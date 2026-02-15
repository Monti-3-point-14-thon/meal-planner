import { callOpenRouter } from "./openrouter";

interface GenerateMealPlanInput {
  profile: any;
  primaryGoal: string;
  customPrompt?: string;
}

interface AIDay {
  dayNumber: number;
  meals: any[];
  snacks: any[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface AIMealPlan {
  days: AIDay[];
}

export async function generateMealPlan({
  profile,
  primaryGoal,
  customPrompt,
}: GenerateMealPlanInput): Promise<AIMealPlan> {
  // Build system prompt
  const systemPrompt = `You are an expert nutritionist and meal planning AI. Generate a personalized 1-day meal plan based on the user's profile and goals.

CRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED):
${profile.dietaryRestrictions.length > 0 ? profile.dietaryRestrictions.join(", ") : "None"}

Food Preferences (avoid when possible):
${profile.foodPreferences.dislikes.length > 0 ? profile.foodPreferences.dislikes.join(", ") : "None"}

User Profile:
- Age: ${profile.biometrics.age}
- Sex: ${profile.biometrics.sex}
- Weight: ${profile.biometrics.weight} kg
- Height: ${profile.biometrics.height} cm
- Location: ${profile.location}
- Preferred Cuisines: ${profile.culturalCuisines.join(", ")}
- Primary Goal: ${primaryGoal.replace(/_/g, " ")}

Requirements:
1. Generate exactly 1 day of meal plan (for testing purposes)
2. The day must have: breakfast, lunch, dinner, and 1-3 snacks
3. Respect all dietary restrictions (NEVER violate these)
4. Prefer cuisines from user's preferences
5. Include detailed macros (calories, protein, carbs, fat, fiber)
6. Provide ingredients with quantities
7. Include cooking instructions
8. Add nutritional reasoning for each meal
9. For snacks, portability MUST be exactly: "portable", "semi_portable", or "not_portable"
10. Snack types MUST be exactly: "morning_snack", "afternoon_snack", or "evening_snack"
11. Meal types MUST be exactly: "breakfast", "lunch", or "dinner"

Return ONLY valid JSON in this exact format:
{
  "days": [
    {
      "dayNumber": 1,
      "meals": [
        {
          "type": "breakfast",
          "name": "Meal Name",
          "ingredients": [{"name": "ingredient", "quantity": "100g"}],
          "instructions": "Step-by-step instructions",
          "macros": {"calories": 500, "protein": 30, "carbs": 50, "fat": 15, "fiber": 10},
          "nutritionalReasoning": "Why this meal supports the goal",
          "scientificSources": ["url1", "url2"],
          "prepTimeMinutes": 30
        }
      ],
      "snacks": [
        {
          "type": "morning_snack",
          "name": "Snack Name",
          "ingredients": [{"name": "ingredient", "quantity": "50g"}],
          "instructions": "How to prepare",
          "macros": {"calories": 200, "protein": 10, "carbs": 20, "fat": 8, "fiber": 5},
          "nutritionalReasoning": "Why this snack",
          "scientificSources": [],
          "portability": "portable",
          "prepTimeMinutes": 5,
          "idealTiming": "2 hours before lunch"
        }
      ],

IMPORTANT: Snack "portability" must be EXACTLY one of these values:
- "portable" (easy to carry and eat on-the-go)
- "semi_portable" (can be transported but needs some setup)
- "not_portable" (must be eaten at home/restaurant)

Snack "type" must be EXACTLY one of: "morning_snack", "afternoon_snack", "evening_snack"
      "dailyTotals": {"calories": 2000, "protein": 150, "carbs": 200, "fat": 60, "fiber": 30}
    }
  ]
}`;

  const userPrompt = customPrompt
    ? `User's custom request: ${customPrompt}\n\nGenerate the 1-day meal plan.`
    : "Generate a 1-day meal plan optimized for my profile and goals.";

  // Call AI
  const response = await callOpenRouter({
    model: "anthropic/claude-3.5-sonnet",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 8000,
  });

  // Parse JSON response
  let parsedPlan: AIMealPlan;
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    parsedPlan = JSON.parse(jsonText);

    // Validate structure
    if (!parsedPlan.days || !Array.isArray(parsedPlan.days)) {
      throw new Error("Invalid meal plan structure: missing days array");
    }

    if (parsedPlan.days.length !== 1) {
      throw new Error(`Expected 1 day, got ${parsedPlan.days.length}`);
    }

    // Validate each day has required fields
    for (const day of parsedPlan.days) {
      if (!day.meals || !Array.isArray(day.meals)) {
        throw new Error(`Day ${day.dayNumber} missing meals array`);
      }
      if (!day.snacks || !Array.isArray(day.snacks)) {
        throw new Error(`Day ${day.dayNumber} missing snacks array`);
      }
      if (!day.dailyTotals) {
        throw new Error(`Day ${day.dayNumber} missing dailyTotals`);
      }
    }
  } catch (error: any) {
    console.error("Failed to parse AI meal plan:", error);
    console.error("Raw AI response:", response);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }

  return parsedPlan;
}
