// OpenRouter SDK wrapper for multi-model AI access

import OpenAI from 'openai';
import crypto from 'crypto';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Meal Planner',
  },
});

export interface ModelOptions {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
}

export interface CallModelResponse {
  success: boolean;
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

/**
 * Call an AI model via OpenRouter
 * @param model - Model ID (e.g., 'google/gemini-flash-1.5')
 * @param messages - Array of chat messages
 * @param options - Optional model parameters
 * @returns Response with generated content
 */
export async function callModel(
  model: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: ModelOptions
): Promise<CallModelResponse> {
  // Generate correlation ID for request tracking
  const requestId = crypto.randomUUID();
  const requestTimestamp = new Date().toISOString();

  // Log request details
  console.log('🔵 [OpenRouter] Request starting', JSON.stringify({
    requestId,
    timestamp: requestTimestamp,
    model,
    messagesCount: messages.length,
    systemMessageLength: messages.find(m => m.role === 'system')?.content.length || 0,
    userMessageLength: messages.find(m => m.role === 'user')?.content.length || 0,
    options: {
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 8000,
      top_p: options?.top_p ?? 1,
      frequency_penalty: options?.frequency_penalty ?? 0.4,
    },
    apiKeyPresent: !!process.env.OPENROUTER_API_KEY,
    apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...',
    baseURL: 'https://openrouter.ai/api/v1',
    headers: {
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'Meal Planner',
    },
  }, null, 2));

  try {
    const completion = await openrouter.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 8000,
      top_p: options?.top_p ?? 1,
      frequency_penalty: options?.frequency_penalty ?? 0.4,
    });

    const choice = completion.choices[0];
    if (!choice || !choice.message.content) {
      throw new Error('No response from model');
    }

    const responseTimestamp = new Date().toISOString();
    console.log('✅ [OpenRouter] Request succeeded', JSON.stringify({
      requestId,
      timestamp: responseTimestamp,
      responseModel: completion.model,
      choicesCount: completion.choices?.length || 0,
      contentLength: choice.message.content?.length || 0,
      usage: completion.usage,
      latencyMs: Date.now() - new Date(requestTimestamp).getTime(),
    }, null, 2));

    return {
      success: true,
      content: choice.message.content,
      model: completion.model,
      usage: completion.usage
        ? {
            prompt_tokens: completion.usage.prompt_tokens,
            completion_tokens: completion.usage.completion_tokens,
            total_tokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error: any) {
    const errorTimestamp = new Date().toISOString();

    // Log comprehensive error details
    console.error('❌ [OpenRouter] Request failed', JSON.stringify({
      requestId,
      timestamp: errorTimestamp,
      latencyMs: Date.now() - new Date(requestTimestamp).getTime(),

      // Error basics
      errorMessage: error?.message || 'Unknown error',
      errorName: error?.name,
      errorCode: error?.code,

      // HTTP details
      httpStatus: error?.status || error?.response?.status,
      httpStatusText: error?.response?.statusText,

      // Response body (if available)
      responseData: error?.response?.data,
      responseBody: error?.response?.body,

      // Request details (for debugging)
      requestModel: model,
      requestMessagesCount: messages.length,

      // Headers (might contain rate limit info)
      responseHeaders: error?.response?.headers,

      // Full error object structure (last resort)
      errorKeys: Object.keys(error || {}),
      errorType: typeof error,
    }, null, 2));

    // Handle rate limits
    if (error?.status === 429 || error?.response?.status === 429) {
      throw new Error('RATE_LIMIT');
    }

    // Re-throw with original message
    throw new Error(error?.message || 'AI generation failed');
  }
}

/**
 * Get the configured model from environment or use default
 */
export function getDefaultModel(): string {
  return process.env.OPENROUTER_MODEL || 'google/gemini-flash-1.5-8b';
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: Error): boolean {
  return error.message === 'RATE_LIMIT';
}
