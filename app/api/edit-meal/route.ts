// API route for editing/regenerating a specific meal

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { UserSettings, Meal, MealEdit } from '@/lib/types';
import { buildMealEditPrompt } from '@/lib/ai/prompts';
import { callModel, getDefaultModel } from '@/lib/ai/openrouter';
import {
  searchScientificEvidence,
  shouldValidateClaim,
  isTavilyConfigured,
} from '@/lib/ai/tavily';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { meal, editInstruction, settings }: {
      meal: Meal;
      editInstruction: string;
      settings: UserSettings;
    } = body;

    if (!meal || !editInstruction || !settings) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build AI prompts
    const { system, user } = buildMealEditPrompt(meal, editInstruction, settings);

    // Call AI model
    console.log(`Regenerating ${meal.type} with instruction: "${editInstruction}"`);
    const response = await callModel(
      getDefaultModel(),
      [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      {
        temperature: 0.7,
        max_tokens: 2000,
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

    // Create edit history entry
    const editEntry: MealEdit = {
      timestamp: new Date().toISOString(),
      instruction: editInstruction,
      previous_macros: meal.macros,
      previous_name: meal.name,
    };

    // Create updated meal object
    const updatedMeal: Meal = {
      ...meal,
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
      prep_time_minutes: aiData.prep_time_minutes || meal.prep_time_minutes,
      instructions: aiData.instructions || '',
      edit_history: [...meal.edit_history, editEntry],
    };

    // Selective Tavily validation (only if uncertain language detected)
    if (isTavilyConfigured() && shouldValidateClaim(updatedMeal.nutritional_reasoning)) {
      console.log(`Validating claim for edited ${updatedMeal.name}...`);
      try {
        const results = await searchScientificEvidence(
          updatedMeal.nutritional_reasoning,
          2
        );
        updatedMeal.scientific_sources = results.results.map((r) => r.url);
        console.log(`Added ${updatedMeal.scientific_sources.length} sources`);
      } catch (error) {
        console.warn(`Tavily validation failed:`, error);
        // Continue without sources - non-blocking
      }
    }

    // Return updated meal
    return NextResponse.json({
      success: true,
      meal: updatedMeal,
    });
  } catch (error: any) {
    console.error('Meal edit error:', error);

    // Return user-friendly error
    return NextResponse.json(
      {
        error: 'Failed to edit meal',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
