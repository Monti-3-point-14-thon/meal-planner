// AI Prompt builders for meal plan generation and editing

import { UserSettings, Meal, MealType } from '@/lib/types';

/**
 * Build the initial meal plan generation prompt
 * @param settings - User settings with goals, biometrics, cultural context, and restrictions
 * @returns System and user messages for AI
 */
export function buildMealPlanPrompt(settings: UserSettings): {
  system: string;
  user: string;
} {
  const { primary_goal, biometrics, cultural_context, food_preferences, dietary_restrictions } = settings;

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const bmr = calculateBMR(biometrics);
  const targetCalories = adjustCaloriesForGoal(bmr, primary_goal, biometrics.sex);

  // Map goal to nutritional focus
  const goalContext = getGoalContext(primary_goal);

  // Format food preferences as soft constraints
  const preferencesText =
    food_preferences.dislikes.length > 0
      ? `\n\nFOOD PREFERENCES (avoid when possible):\n${food_preferences.dislikes.map((p) => `- ${p}`).join('\n')}`
      : '';

  // Format dietary restrictions as hard constraints
  const restrictionsText =
    dietary_restrictions.length > 0
      ? `\n\nCRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED - NEVER VIOLATE):\n${dietary_restrictions.map((r) => `- ${r}`).join('\n')}`
      : '';

  const systemPrompt = `You are an expert nutritionist and meal planner with deep knowledge of:
- Evidence-based nutrition science
- Cultural cuisines and ingredient availability
- Dietary restrictions and food allergies
- Macronutrient optimization for health goals

Your task is to create personalized, science-backed meal plans that are:
1. Nutritionally optimized for the user's specific health goal
2. Culturally appropriate and use locally available ingredients
3. Strictly compliant with all dietary restrictions
4. Practical and enjoyable to prepare and eat

Always provide clear nutritional reasoning based on scientific evidence.`;

  const userPrompt = `Create a personalized 1-day meal plan for the following user:

**User Profile:**
- Age: ${biometrics.age} years
- Sex: ${biometrics.sex}
- Weight: ${biometrics.weight} kg
- Height: ${biometrics.height} cm
- Primary Goal: ${goalContext.name}
- Cultural Preference: ${cultural_context.cuisines.join(', ')} cuisine
- Location: ${cultural_context.location}${preferencesText}${restrictionsText}

**Nutritional Target:**
- Target Daily Calories: ~${targetCalories} kcal
- Goal-Specific Focus: ${goalContext.focus}
- Macro Distribution: ${goalContext.macros}

**Requirements:**
1. Create exactly 3 meals: Breakfast, Lunch, and Dinner
2. Each meal must include:
   - A descriptive, appetizing name
   - Complete ingredient list with quantities
   - Detailed macronutrient breakdown (calories, protein, carbs, fat, fiber)
   - Scientific nutritional reasoning (2-3 sentences explaining why this meal supports their goal)
   - Preparation time estimate
   - Cooking instructions (brief)
3. Meals should draw from ${cultural_context.cuisines.join(', ')} cuisine preferences
4. Use ingredients commonly available in ${cultural_context.location}
5. Total daily macros should sum to approximately ${targetCalories} kcal
${dietary_restrictions.length > 0 ? `6. ABSOLUTELY NO ingredients that violate these restrictions: ${dietary_restrictions.join(', ')}` : ''}

**Output Format:**
Return a valid JSON object with this exact structure:

{
  "meals": [
    {
      "type": "breakfast" | "lunch" | "dinner",
      "name": "Meal name",
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
      "nutritional_reasoning": "Scientific explanation of why this meal supports the user's goal",
      "prep_time_minutes": number,
      "instructions": "Brief cooking instructions"
    }
  ],
  "daily_totals": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number
  }
}

Return ONLY the JSON object, no additional text.`;

  return {
    system: systemPrompt,
    user: userPrompt,
  };
}

/**
 * Build prompt for editing a specific meal
 * @param meal - The meal to edit
 * @param editInstruction - User's editing instruction
 * @param settings - Original user settings for context
 * @returns System and user messages for AI
 */
export function buildMealEditPrompt(
  meal: Meal,
  editInstruction: string,
  settings: UserSettings
): {
  system: string;
  user: string;
} {
  const { primary_goal, biometrics, cultural_context, food_preferences, dietary_restrictions } = settings;
  const goalContext = getGoalContext(primary_goal);

  const preferencesText =
    food_preferences.dislikes.length > 0
      ? `\n\nFOOD PREFERENCES (avoid when possible):\n${food_preferences.dislikes.map((p) => `- ${p}`).join('\n')}`
      : '';

  const restrictionsText =
    dietary_restrictions.length > 0
      ? `\n\nCRITICAL DIETARY RESTRICTIONS (MUST BE FOLLOWED - NEVER VIOLATE):\n${dietary_restrictions.map((r) => `- ${r}`).join('\n')}`
      : '';

  const systemPrompt = `You are an expert nutritionist helping refine a meal plan. You must:
1. Maintain nutritional quality and goal alignment
2. Respect all dietary restrictions
3. Keep meals culturally appropriate
4. Provide scientific reasoning for changes`;

  const userPrompt = `Modify the following ${meal.type} meal based on the user's request.

**Current Meal:**
Name: ${meal.name}
Macros: ${meal.macros.calories} kcal, ${meal.macros.protein}g protein, ${meal.macros.carbs}g carbs, ${meal.macros.fat}g fat
Ingredients: ${meal.ingredients.map((ing) => `${ing.name} (${ing.amount})`).join(', ')}

**User's Edit Request:**
"${editInstruction}"

**User Context (maintain alignment):**
- Goal: ${goalContext.name}
- Cultural Preference: ${cultural_context.cuisines.join(', ')} cuisine
- Location: ${cultural_context.location}${preferencesText}${restrictionsText}

**Requirements:**
1. Apply the user's requested changes
2. Maintain similar calorie count (±100 kcal) unless user specifically requests change
3. Keep macros aligned with goal: ${goalContext.macros}
4. Ensure all dietary restrictions are still respected
5. Provide updated nutritional reasoning explaining the changes

**Output Format:**
Return a valid JSON object with this exact structure:

{
  "type": "${meal.type}",
  "name": "Updated meal name",
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
  "nutritional_reasoning": "Scientific explanation of changes and continued goal alignment",
  "prep_time_minutes": number,
  "instructions": "Brief cooking instructions"
}

Return ONLY the JSON object, no additional text.`;

  return {
    system: systemPrompt,
    user: userPrompt,
  };
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
function calculateBMR(biometrics: {
  weight: number;
  height: number;
  age: number;
  sex: 'male' | 'female' | 'other';
}): number {
  const { weight, height, age, sex } = biometrics;

  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (sex === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // For 'other', use average of male and female formulas
    const maleBMR = 10 * weight + 6.25 * height - 5 * age + 5;
    const femaleBMR = 10 * weight + 6.25 * height - 5 * age - 161;
    return (maleBMR + femaleBMR) / 2;
  }
}

/**
 * Adjust calories for goal and activity level
 */
function adjustCaloriesForGoal(
  bmr: number,
  goal: string,
  sex: 'male' | 'female' | 'other'
): number {
  // Assume moderate activity level (BMR * 1.5)
  const tdee = bmr * 1.5;

  switch (goal) {
    case 'muscle_building':
      // Surplus for muscle gain
      return Math.round(tdee + 300);
    case 'weight_loss':
      // Deficit for fat loss (not too aggressive)
      return Math.round(tdee - 500);
    case 'gut_health':
    case 'mental_performance':
    case 'general_health':
      // Maintenance calories
      return Math.round(tdee);
    default:
      return Math.round(tdee);
  }
}

/**
 * Get goal-specific context for prompts
 */
function getGoalContext(goal: string): {
  name: string;
  focus: string;
  macros: string;
} {
  switch (goal) {
    case 'muscle_building':
      return {
        name: 'Muscle Building',
        focus:
          'High protein intake (1.6-2.2g per kg bodyweight), adequate carbs for energy, moderate healthy fats',
        macros: '30% protein, 40% carbs, 30% fat',
      };
    case 'weight_loss':
      return {
        name: 'Weight Loss',
        focus:
          'High protein to preserve muscle, moderate carbs, healthy fats, high fiber for satiety',
        macros: '35% protein, 35% carbs, 30% fat',
      };
    case 'gut_health':
      return {
        name: 'Gut Health',
        focus:
          'High fiber from diverse sources, fermented foods, prebiotics and probiotics, anti-inflammatory foods',
        macros: '20% protein, 50% carbs (fiber-rich), 30% fat',
      };
    case 'mental_performance':
      return {
        name: 'Mental Performance',
        focus:
          'Omega-3 fatty acids, B vitamins, antioxidants, complex carbs for stable energy, anti-inflammatory foods',
        macros: '25% protein, 45% carbs (complex), 30% fat (omega-3 rich)',
      };
    case 'general_health':
      return {
        name: 'General Health',
        focus:
          'Balanced macros, variety of whole foods, adequate micronutrients, anti-inflammatory foods',
        macros: '25% protein, 45% carbs, 30% fat',
      };
    default:
      return {
        name: 'General Health',
        focus: 'Balanced nutrition with whole foods',
        macros: '25% protein, 45% carbs, 30% fat',
      };
  }
}
