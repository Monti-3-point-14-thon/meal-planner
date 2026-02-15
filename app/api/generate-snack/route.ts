// API route for generating a single snack

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { UserSettings, Meal } from '@/lib/types';
import { callModel, getDefaultModel } from '@/lib/ai/openrouter';
import {
  searchScientificEvidence,
  shouldValidateClaim,
  isTavilyConfigured,
} from '@/lib/ai/tavily';

interface SnackPreferences {
  timing: 'morning' | 'afternoon' | 'evening';
  calorieTarget: number;
  preference?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { settings, preferences }: {
      settings: UserSettings;
      preferences: SnackPreferences;
    } = body;

    if (!settings || !preferences) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build snack generation prompt
    const { system, user } = buildSnackPrompt(settings, preferences);

    // Call AI model
    console.log(`Generating ${preferences.timing} snack (~${preferences.calorieTarget} kcal)`);
    const response = await callModel(
      getDefaultModel(),
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      {
        temperature: 0.7,
        max_tokens: 1500,
      }
    );

    if (!response.success || !response.content) {
      throw new Error(response.error || 'AI model returned no content');
    }

    // Parse AI response
    let aiData;
    try {
      // Extract JSON from response (in case AI wraps it in markdown)
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : response.content;
      aiData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', response.content);
      throw new Error('AI returned invalid JSON format');
    }

    // Validate structure
    if (!aiData.name || !aiData.ingredients || !aiData.macros) {
      throw new Error('AI response missing required fields');
    }

    // Create snack meal object
    const snack: Meal = {
      id: uuidv4(),
      type: `snack_${preferences.timing}` as any,
      name: aiData.name,
      ingredients: aiData.ingredients || [],
      macros: aiData.macros || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      },
      nutritional_reasoning: aiData.nutritional_reasoning || '',
      scientific_sources: [], // Will be populated if validation occurs
      prep_time_minutes: aiData.prep_time_minutes || 5,
      instructions: aiData.instructions || '',
      edit_history: [],
    };

    // Selective Tavily validation (only if uncertain language detected)
    if (isTavilyConfigured() && shouldValidateClaim(snack.nutritional_reasoning)) {
      console.log(`Validating claim for snack...`);
      try {
        const results = await searchScientificEvidence(
          snack.nutritional_reasoning,
          2
        );
        snack.scientific_sources = results.results.map((r) => r.url);
        console.log(`Added ${snack.scientific_sources.length} sources`);
      } catch (error) {
        console.warn(`Tavily validation failed:`, error);
        // Continue without sources - non-blocking
      }
    }

    // Return snack
    return NextResponse.json({
      success: true,
      snack,
    });
  } catch (error: any) {
    console.error('Snack generation error:', error);

    // Return user-friendly error
    return NextResponse.json(
      {
        error: 'Failed to generate snack',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Build prompt for snack generation
 */
function buildSnackPrompt(
  settings: UserSettings,
  preferences: SnackPreferences
): {
  system: string;
  user: string;
} {
  const { primary_goal, biometrics, cultural_context, dietary_restrictions } = settings;
  const { timing, calorieTarget, preference } = preferences;

  // Map timing to description
  const timingDesc = {
    morning: 'mid-morning (between breakfast and lunch)',
    afternoon: 'mid-afternoon (between lunch and dinner)',
    evening: 'evening (after dinner)',
  }[timing];

  // Get goal context
  const goalContext = getSnackGoalContext(primary_goal);

  const restrictionsText =
    dietary_restrictions.length > 0
      ? `\n\nCRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED):\n${dietary_restrictions.map((r) => `- ${r}`).join('\n')}`
      : '';

  const systemPrompt = `You are an expert nutritionist creating personalized snack recommendations based on:
- User's health goals and nutritional needs
- Timing and purpose of the snack
- Cultural preferences and ingredient availability
- Dietary restrictions

Provide science-backed snack ideas that fit seamlessly into the user's meal plan.`;

  const userPrompt = `Create a personalized snack for the following user:

**User Profile:**
- Age: ${biometrics.age}, Sex: ${biometrics.sex}
- Weight: ${biometrics.weight} kg, Height: ${biometrics.height} cm
- Primary Goal: ${goalContext.name}
- Cultural Preferences: ${cultural_context.cuisines.join(", ")} cuisines
- Location: ${cultural_context.location}${restrictionsText}

**Snack Requirements:**
- Timing: ${timingDesc}
- Target Calories: ~${calorieTarget} kcal (±50 kcal is acceptable)
- Purpose: ${goalContext.snackPurpose}
${preference ? `- User Preference: ${preference}` : ''}

**Requirements:**
1. Keep it simple and quick to prepare (≤10 minutes)
2. Appropriate for the timing (e.g., no heavy foods late at night)
3. Support the user's health goal: ${goalContext.focus}
4. Align with ${cultural_context.cuisines.join(", ")} preferences when possible
5. Use ingredients available in ${cultural_context.location}
${dietary_restrictions.length > 0 ? `6. ABSOLUTELY NO ingredients that violate: ${dietary_restrictions.join(', ')}` : ''}

**Output Format:**
Return a valid JSON object with this exact structure:

{
  "name": "Snack name",
  "ingredients": [
    {
      "name": "Ingredient name",
      "amount": "Quantity with unit",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "macros": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  },
  "nutritional_reasoning": "Brief explanation of why this snack supports the user's goal at this time of day",
  "prep_time_minutes": number,
  "instructions": "Very brief prep instructions"
}

Return ONLY the JSON object, no additional text.`;

  return {
    system: systemPrompt,
    user: userPrompt,
  };
}

/**
 * Get snack-specific goal context
 */
function getSnackGoalContext(goal: string): {
  name: string;
  focus: string;
  snackPurpose: string;
} {
  switch (goal) {
    case 'muscle_building':
      return {
        name: 'Muscle Building',
        focus: 'Protein-rich to support muscle recovery and growth',
        snackPurpose: 'Provide protein and prevent muscle breakdown between meals',
      };
    case 'weight_loss':
      return {
        name: 'Weight Loss',
        focus: 'High satiety, low calorie density',
        snackPurpose: 'Control hunger while staying within calorie budget',
      };
    case 'gut_health':
      return {
        name: 'Gut Health',
        focus: 'Fiber-rich, prebiotic/probiotic foods',
        snackPurpose: 'Support digestive health and beneficial gut bacteria',
      };
    case 'mental_performance':
      return {
        name: 'Mental Performance',
        focus: 'Sustained energy, brain-healthy nutrients',
        snackPurpose: 'Maintain stable blood sugar and support cognitive function',
      };
    case 'general_health':
      return {
        name: 'General Health',
        focus: 'Balanced, nutrient-dense',
        snackPurpose: 'Provide sustained energy and key nutrients',
      };
    default:
      return {
        name: 'General Health',
        focus: 'Balanced nutrition',
        snackPurpose: 'Provide energy and nutrition between meals',
      };
  }
}
