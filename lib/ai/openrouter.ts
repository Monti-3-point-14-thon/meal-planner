// OpenRouter SDK wrapper for multi-model AI access

import OpenAI from 'openai';

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
}

export interface CallModelResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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
  try {
    const completion = await openrouter.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 4000,
      top_p: options?.top_p ?? 1,
    });

    const choice = completion.choices[0];
    if (!choice || !choice.message.content) {
      throw new Error('No response from model');
    }

    return {
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
    // Handle rate limits
    if (error?.status === 429) {
      throw new Error('RATE_LIMIT');
    }

    // Handle other errors
    console.error('OpenRouter error:', error);
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
