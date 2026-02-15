import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/auth";
import connectMongo from "@/libs/mongoose";
import UserProfile from "@/models/UserProfile";

// POST - Create user profile
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await req.json();

    // Check if profile already exists
    const existing = await UserProfile.findOne({ userId: session.user.id });
    if (existing) {
      return NextResponse.json(
        { error: "Profile already exists. Use PUT to update." },
        { status: 400 }
      );
    }

    // Validate required fields
    const { biometrics, culturalCuisines, location } = body;
    if (
      !biometrics?.weight ||
      !biometrics?.height ||
      !biometrics?.age ||
      !biometrics?.sex
    ) {
      return NextResponse.json(
        { error: "Missing required biometrics fields" },
        { status: 400 }
      );
    }

    if (!culturalCuisines || culturalCuisines.length === 0) {
      return NextResponse.json(
        { error: "At least one cuisine must be selected" },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    // Create profile
    const profile = await UserProfile.create({
      userId: session.user.id,
      biometrics,
      dietaryRestrictions: body.dietaryRestrictions || [],
      foodPreferences: {
        dislikes: body.foodPreferences?.dislikes || [],
      },
      culturalCuisines,
      location,
      trainingContext: body.trainingContext || {},
      healthContext: body.healthContext || {},
      metadata: body.metadata || {},
    });

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error: any) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Fetch user profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const profile = await UserProfile.findOne({ userId: session.user.id });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await req.json();

    // Find existing profile
    const profile = await UserProfile.findOne({ userId: session.user.id });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Use POST to create." },
        { status: 404 }
      );
    }

    // Update fields (partial updates allowed)
    if (body.biometrics) {
      profile.biometrics = { ...profile.biometrics, ...body.biometrics };
    }
    if (body.dietaryRestrictions !== undefined) {
      profile.dietaryRestrictions = body.dietaryRestrictions;
    }
    if (body.foodPreferences?.dislikes !== undefined) {
      profile.foodPreferences.dislikes = body.foodPreferences.dislikes;
    }
    if (body.culturalCuisines !== undefined) {
      profile.culturalCuisines = body.culturalCuisines;
    }
    if (body.location) {
      profile.location = body.location;
    }
    if (body.trainingContext !== undefined) {
      profile.trainingContext = body.trainingContext;
    }
    if (body.healthContext !== undefined) {
      profile.healthContext = body.healthContext;
    }
    if (body.metadata !== undefined) {
      profile.metadata = body.metadata;
    }

    await profile.save();

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
