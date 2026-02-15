interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export async function callOpenRouter({
  model,
  messages,
  temperature = 0.7,
  max_tokens = 4000,
  top_p = 1,
}: OpenRouterRequest): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set in environment variables"
    );
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
      "X-Title": "Meal Planner",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty: 0.4,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("OpenRouter API error:", errorData);
    throw new Error(
      `OpenRouter API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error("Invalid response format from OpenRouter API");
  }

  return data.choices[0].message.content;
}
