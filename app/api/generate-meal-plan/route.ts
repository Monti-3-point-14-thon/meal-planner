// API route for generating personalized meal plans

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { UserSettings, MealPlan, Meal } from '@/lib/types';
import { buildMealPlanPrompt } from '@/lib/ai/prompts';
import { callModel, getDefaultModel } from '@/lib/ai/openrouter';
import {
  searchScientificEvidence,
  shouldValidateClaim,
  isTavilyConfigured,
} from '@/lib/ai/tavily';

export async function POST(request: NextRequest) {
  let requestId = 'unknown'; // Declare at function scope for error handler

  try {
    // Parse request body
    const body = await request.json();
    const settings: UserSettings = body.settings;

    if (!settings) {
      return NextResponse.json(
        { error: 'Missing user settings' },
        { status: 400 }
      );
    }

    // Generate request ID for tracking
    requestId = crypto.randomUUID();
    console.log('🔵 [MealGen] Request received', JSON.stringify({
      requestId,
      timestamp: new Date().toISOString(),
      settingsId: settings.id,
      goal: settings.primary_goal,
      biometrics: {
        age: settings.biometrics.age,
        sex: settings.biometrics.sex,
        weight: settings.biometrics.weight,
        height: settings.biometrics.height,
      },
      culturalCuisines: settings.cultural_context.cuisines,
      preferencesCount: settings.food_preferences?.dislikes?.length || 0,
      restrictionsCount: settings.dietary_restrictions.length,
    }, null, 2));

    // Build AI prompts
    const { system, user } = buildMealPlanPrompt(settings);

    console.log('🔵 [MealGen] Prompts built', JSON.stringify({
      requestId,
      timestamp: new Date().toISOString(),
      systemPromptLength: system.length,
      userPromptLength: user.length,
      systemPromptPreview: system.substring(0, 200) + '...',
      userPromptPreview: user.substring(0, 200) + '...',
    }, null, 2));

    // Call AI model
    const modelToUse = getDefaultModel();
    console.log('🔵 [MealGen] Calling AI model', JSON.stringify({
      requestId,
      timestamp: new Date().toISOString(),
      model: modelToUse,
      temperature: 0.7,
      max_tokens: 8000,
    }, null, 2));

    const response = await callModel(
      modelToUse,
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      {
        temperature: 0.7,
        max_tokens: 8000,
      }
    );

    console.log('✅ [MealGen] AI response received', JSON.stringify({
      requestId,
      timestamp: new Date().toISOString(),
      responseSuccess: response.success,
      contentLength: response.content?.length || 0,
      contentPreview: response.content?.substring(0, 200) + '...',
    }, null, 2));

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
    if (!aiData.meals || !Array.isArray(aiData.meals)) {
      throw new Error('AI response missing meals array');
    }

    // Process meals and add IDs
    const meals: Meal[] = aiData.meals.map((mealData: any) => {
      const meal: Meal = {
        id: uuidv4(),
        type: mealData.type,
        name: mealData.name,
        ingredients: mealData.ingredients || [],
        macros: mealData.macros || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
        },
        nutritional_reasoning: mealData.nutritional_reasoning || '',
        scientific_sources: [], // Will be populated if validation occurs
        prep_time_minutes: mealData.prep_time_minutes || 30,
        instructions: mealData.instructions || '',
        edit_history: [],
      };
      return meal;
    });

    // Selective Tavily validation (only if uncertain language detected)
    if (isTavilyConfigured()) {
      console.log('Checking for claims that need validation...');

      for (const meal of meals) {
        if (shouldValidateClaim(meal.nutritional_reasoning)) {
          console.log(`Validating claim for ${meal.name}...`);
          try {
            const results = await searchScientificEvidence(
              meal.nutritional_reasoning,
              2
            );
            meal.scientific_sources = results.results.map((r) => r.url);
            console.log(`Added ${meal.scientific_sources.length} sources for ${meal.name}`);
          } catch (error) {
            console.warn(`Tavily validation failed for ${meal.name}:`, error);
            // Continue without sources - non-blocking
          }
        }
      }
    }

    // Create MealPlan object
    const mealPlan: MealPlan = {
      id: uuidv4(),
      user_settings_id: settings.id,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      meals,
      daily_totals: aiData.daily_totals || calculateDailyTotals(meals),
      created_at: new Date().toISOString(),
    };

    // Return meal plan
    return NextResponse.json({
      success: true,
      mealPlan,
    });
  } catch (error: any) {
    console.error('❌ [MealGen] Generation failed', JSON.stringify({
      requestId,
      timestamp: new Date().toISOString(),
      errorMessage: error?.message,
      errorStack: error?.stack?.split('\n').slice(0, 3), // First 3 lines
      errorType: error?.constructor?.name,
    }, null, 2));

    // Return user-friendly error with details
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate meal plan',
        details: error.message || 'Unknown error',
        requestId,
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate daily totals from meals (fallback if AI doesn't provide)
 */
function calculateDailyTotals(meals: Meal[]) {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.macros.calories,
      protein: totals.protein + meal.macros.protein,
      carbs: totals.carbs + meal.macros.carbs,
      fat: totals.fat + meal.macros.fat,
      fiber: totals.fiber + meal.macros.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}
