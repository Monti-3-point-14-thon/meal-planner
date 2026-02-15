import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import WeekPlan from "@/models/WeekPlan";
import DayPlan from "@/models/DayPlan";
import Meal from "@/models/Meal";
import Snack from "@/models/Snack";

// GET - Fetch single meal plan with all details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;

    // Fetch week plan
    const weekPlan = await WeekPlan.findOne({
      _id: id,
      userId: session.user.id, // Ensure user owns this plan
    }).lean();

    if (!weekPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Fetch all day plans for this week
    const dayPlans = await DayPlan.find({
      weekPlanId: weekPlan._id,
    })
      .sort({ date: 1 })
      .lean();

    // Fetch meals and snacks for each day
    const daysWithDetails = await Promise.all(
      dayPlans.map(async (dayPlan) => {
        const meals = await Meal.find({
          dayPlanId: dayPlan._id,
        })
          .sort({ type: 1 }) // Sort by meal type
          .lean();

        const snacks = await Snack.find({
          dayPlanId: dayPlan._id,
        })
          .sort({ type: 1 }) // Sort by snack type
          .lean();

        return {
          ...dayPlan,
          meals,
          snacks,
        };
      })
    );

    return NextResponse.json({
      success: true,
      weekPlan: {
        ...weekPlan,
        days: daysWithDetails,
      },
    });
  } catch (error: any) {
    console.error("Meal plan fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch meal plan" },
      { status: 500 }
    );
  }
}

// PUT - Update meal plan metadata
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;
    const body = await req.json();

    // Find week plan
    const weekPlan = await WeekPlan.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!weekPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (body.primaryGoal) {
      weekPlan.primaryGoal = body.primaryGoal;
    }

    await weekPlan.save();

    return NextResponse.json({ success: true, weekPlan });
  } catch (error: any) {
    console.error("Meal plan update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update meal plan" },
      { status: 500 }
    );
  }
}

// DELETE - Delete meal plan and all associated data
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;

    // Find week plan
    const weekPlan = await WeekPlan.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!weekPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Get all day plans
    const dayPlans = await DayPlan.find({ weekPlanId: weekPlan._id });
    const dayPlanIds = dayPlans.map((dp) => dp._id);

    // Delete meals and snacks
    await Meal.deleteMany({ dayPlanId: { $in: dayPlanIds } });
    await Snack.deleteMany({ dayPlanId: { $in: dayPlanIds } });

    // Delete day plans
    await DayPlan.deleteMany({ weekPlanId: weekPlan._id });

    // Delete week plan
    await WeekPlan.deleteOne({ _id: weekPlan._id });

    return NextResponse.json({
      success: true,
      message: "Meal plan deleted successfully",
    });
  } catch (error: any) {
    console.error("Meal plan deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}
