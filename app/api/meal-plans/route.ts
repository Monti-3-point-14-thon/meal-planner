import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import UserProfile from "@/models/UserProfile";
import WeekPlan from "@/models/WeekPlan";
import DayPlan from "@/models/DayPlan";
import Meal from "@/models/Meal";
import Snack from "@/models/Snack";
import { generateMealPlan } from "@/libs/ai/mealPlanGenerator";

// POST - Generate and save new meal plan
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await req.json();
    const { customPrompt, primaryGoal } = body;

    // Fetch user profile
    const profile = await UserProfile.findOne({ userId: session.user.id });
    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found. Please create a profile first." },
        { status: 404 }
      );
    }

    // Validate primary goal
    const validGoals = [
      "muscle_building",
      "weight_loss",
      "gut_health",
      "mental_performance",
      "general_health",
    ];
    if (!primaryGoal || !validGoals.includes(primaryGoal)) {
      return NextResponse.json(
        { error: "Invalid or missing primaryGoal" },
        { status: 400 }
      );
    }

    // Generate meal plan using AI
    const aiPlan = await generateMealPlan({
      profile,
      primaryGoal,
      customPrompt,
    });

    // Create WeekPlan (marked as incomplete for 1-day testing)
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate); // Same as startDate for 1-day plan

    const weekPlan = await WeekPlan.create({
      userId: session.user.id,
      userProfileId: profile._id,
      startDate,
      endDate,
      primaryGoal,
      status: "incomplete", // Marked as incomplete (1-day testing)
      profileSnapshot: {
        biometrics: profile.biometrics,
        dietaryRestrictions: profile.dietaryRestrictions,
        foodPreferences: profile.foodPreferences,
        culturalCuisines: profile.culturalCuisines,
        location: profile.location,
      },
    });

    // Create DayPlans, Meals, and Snacks
    for (const aiDay of aiPlan.days) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + aiDay.dayNumber - 1);

      const dayPlan = await DayPlan.create({
        weekPlanId: weekPlan._id,
        date: dayDate,
        dailyTotals: aiDay.dailyTotals,
      });

      // Create meals
      for (const aiMeal of aiDay.meals) {
        await Meal.create({
          dayPlanId: dayPlan._id,
          type: aiMeal.type,
          name: aiMeal.name,
          ingredients: aiMeal.ingredients,
          instructions: aiMeal.instructions,
          macros: aiMeal.macros,
          nutritionalReasoning: aiMeal.nutritionalReasoning,
          scientificSources: aiMeal.scientificSources || [],
          prepTimeMinutes: aiMeal.prepTimeMinutes || 30,
          editHistory: [],
        });
      }

      // Create snacks
      for (const aiSnack of aiDay.snacks) {
        await Snack.create({
          dayPlanId: dayPlan._id,
          type: aiSnack.type,
          name: aiSnack.name,
          ingredients: aiSnack.ingredients,
          instructions: aiSnack.instructions,
          macros: aiSnack.macros,
          nutritionalReasoning: aiSnack.nutritionalReasoning,
          scientificSources: aiSnack.scientificSources || [],
          portability: aiSnack.portability || "portable",
          prepTimeMinutes: aiSnack.prepTimeMinutes || 10,
          idealTiming: aiSnack.idealTiming,
          editHistory: [],
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        weekPlanId: weekPlan._id,
        message: "Meal plan generated and saved successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Meal plan generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}

// GET - Fetch all meal plans for current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Fetch all week plans for user, sorted by most recent
    const weekPlans = await WeekPlan.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, weekPlans });
  } catch (error: any) {
    console.error("Meal plans fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}
