// Tavily API wrapper for scientific research and validation

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface TavilySearchResponse {
  results: TavilySearchResult[];
  query: string;
}

/**
 * Search for scientific evidence using Tavily
 * @param query - Search query
 * @param maxResults - Maximum number of results (default: 2)
 * @returns Search results
 */
export async function searchScientificEvidence(
  query: string,
  maxResults: number = 2
): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.warn('Tavily API key not configured, skipping validation');
    return { results: [], query };
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: `scientific evidence ${query} nutrition`,
        search_depth: 'basic',
        max_results: maxResults,
        include_answer: false,
        include_raw_content: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      results: data.results || [],
      query,
    };
  } catch (error) {
    console.error('Tavily search error:', error);
    // Don't fail meal generation if Tavily fails
    return { results: [], query };
  }
}

/**
 * Detect if AI reasoning contains uncertain language that should be validated
 * @param text - AI-generated reasoning text
 * @returns True if validation is recommended
 */
export function shouldValidateClaim(text: string): boolean {
  const uncertainPhrases = [
    'may help',
    'could benefit',
    'might improve',
    'some studies suggest',
    'research indicates',
    'has been shown',
    'may reduce',
    'can improve',
  ];

  const lowerText = text.toLowerCase();
  return uncertainPhrases.some((phrase) => lowerText.includes(phrase));
}

/**
 * Validate a nutritional claim and return sources
 * @param claim - The nutritional claim to validate
 * @returns Array of source URLs
 */
export async function validateNutritionalClaim(claim: string): Promise<string[]> {
  if (!shouldValidateClaim(claim)) {
    return [];
  }

  const results = await searchScientificEvidence(claim, 2);
  return results.results.map((r) => r.url);
}

/**
 * Check if Tavily is configured
 */
export function isTavilyConfigured(): boolean {
  return !!process.env.TAVILY_API_KEY;
}
