// API route for editing/regenerating a specific meal

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import Meal from "@/models/Meal";
import Snack from "@/models/Snack";
import DayPlan from "@/models/DayPlan";
import UserProfile from "@/models/UserProfile";
import { callOpenRouter } from "@/libs/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Parse request body
    const body = await request.json();
    const { mealId, editInstruction, isSnack } = body;

    if (!mealId || !editInstruction) {
      return NextResponse.json(
        { error: "Missing mealId or editInstruction" },
        { status: 400 }
      );
    }

    // Fetch meal or snack from MongoDB
    const Model = isSnack ? Snack : Meal;
    const meal = await Model.findById(mealId);

    if (!meal) {
      return NextResponse.json(
        { error: "Meal not found" },
        { status: 404 }
      );
    }

    // Fetch user profile for context
    const profile = await UserProfile.findOne({ userId: session.user.id });

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Build AI prompt for meal editing
    const systemPrompt = `You are an expert nutritionist. Edit/regenerate the following ${isSnack ? 'snack' : 'meal'} according to the user's instruction.

User Profile:
- Dietary Restrictions (MUST FOLLOW): ${profile.dietaryRestrictions.join(", ") || "None"}
- Food Preferences (avoid when possible): ${profile.foodPreferences.dislikes.join(", ") || "None"}
- Preferred Cuisines: ${profile.culturalCuisines.join(", ")}

Current ${isSnack ? 'Snack' : 'Meal'}:
- Name: ${meal.name}
- Type: ${meal.type}
- Ingredients: ${meal.ingredients.map((i: any) => `${i.name} (${i.quantity})`).join(", ")}
- Macros: ${meal.macros.calories} cal, ${meal.macros.protein}g protein, ${meal.macros.carbs}g carbs, ${meal.macros.fat}g fat

User's Edit Instruction: "${editInstruction}"

Return ONLY valid JSON in this exact format:
{
  "name": "Updated meal name",
  "ingredients": [{"name": "ingredient", "quantity": "100g"}],
  "instructions": "Updated cooking instructions",
  "macros": {"calories": 500, "protein": 30, "carbs": 50, "fat": 15, "fiber": 10},
  "nutritionalReasoning": "Why this updated version is good",
  "prepTimeMinutes": 30${isSnack ? ',\n  "portability": "portable",\n  "idealTiming": "timing suggestion"' : ''}
}`;

    const userPrompt = "Generate the edited meal/snack as JSON.";

    // Call AI
    const response = await callOpenRouter({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Parse AI response
    let aiData;
    try {
      let jsonText = response.trim();
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n?/g, "");
      }
      aiData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", response);
      throw new Error("AI returned invalid JSON format");
    }

    // Validate structure
    if (!aiData.name || !aiData.ingredients || !aiData.macros) {
      throw new Error("AI response missing required fields");
    }

    // Create edit history entry
    const editEntry = {
      editedAt: new Date(),
      instruction: editInstruction,
      previousName: meal.name,
      previousMacros: meal.macros,
    };

    // Update meal fields
    meal.name = aiData.name;
    meal.ingredients = aiData.ingredients;
    meal.instructions = aiData.instructions || "";
    meal.macros = aiData.macros;
    meal.nutritionalReasoning = aiData.nutritionalReasoning || "";
    meal.scientificSources = aiData.scientificSources || [];
    meal.prepTimeMinutes = aiData.prepTimeMinutes || meal.prepTimeMinutes;

    // Update snack-specific fields
    if (isSnack) {
      meal.portability = aiData.portability || meal.portability;
      meal.idealTiming = aiData.idealTiming || meal.idealTiming;
    }

    // Add to edit history
    meal.editHistory = [...meal.editHistory, editEntry];

    // Save updated meal
    await meal.save();

    // Recalculate DayPlan dailyTotals
    const dayPlan = await DayPlan.findById(meal.dayPlanId);
    if (dayPlan) {
      const allMeals = await Meal.find({ dayPlanId: dayPlan._id });
      const allSnacks = await Snack.find({ dayPlanId: dayPlan._id });

      const dailyTotals = [...allMeals, ...allSnacks].reduce(
        (acc, item) => ({
          calories: acc.calories + item.macros.calories,
          protein: acc.protein + item.macros.protein,
          carbs: acc.carbs + item.macros.carbs,
          fat: acc.fat + item.macros.fat,
          fiber: acc.fiber + item.macros.fiber,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      );

      dayPlan.dailyTotals = dailyTotals;
      await dayPlan.save();
    }

    return NextResponse.json({
      success: true,
      meal: meal.toJSON(),
    });
  } catch (error: any) {
    console.error("Meal edit error:", error);

    return NextResponse.json(
      {
        error: "Failed to edit meal",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
