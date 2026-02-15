// Meal plan display page - Fetch and display meal plan from MongoDB

import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import WeekPlan from "@/models/WeekPlan";
import DayPlan from "@/models/DayPlan";
import Meal from "@/models/Meal";
import Snack from "@/models/Snack";
import MealPlanClient from "./MealPlanClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Helper to recursively serialize MongoDB objects (converts ObjectIds to strings)
function serializeMongoDoc(doc: any): any {
  if (doc === null || doc === undefined) return doc;

  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(serializeMongoDoc);
  }

  // Handle objects
  if (typeof doc === 'object') {
    // Convert ObjectId to string
    if (doc._id) {
      doc._id = doc._id.toString();
    }

    // Recursively serialize nested objects
    const serialized: any = {};
    for (const key in doc) {
      if (doc.hasOwnProperty(key)) {
        const value = doc[key];

        // Convert ObjectId fields to strings
        if (value && typeof value === 'object' && value.toString && value.constructor.name === 'ObjectId') {
          serialized[key] = value.toString();
        } else if (value && typeof value === 'object') {
          serialized[key] = serializeMongoDoc(value);
        } else {
          serialized[key] = value;
        }
      }
    }
    return serialized;
  }

  return doc;
}

export default async function MealPlanPage({ params }: PageProps) {
  const session = await auth();

  // Protect route
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Await params in Next.js 15
  const { id } = await params;

  // Fetch meal plan directly from MongoDB
  await connectMongo();

  const weekPlan = await WeekPlan.findOne({
    _id: id,
    userId: session.user.id, // Ensure user owns this plan
  }).lean();

  if (!weekPlan) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="alert alert-error">
            <span>Meal plan not found</span>
          </div>
          <div className="mt-4">
            <a href="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
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
        .sort({ type: 1 })
        .lean();

      const snacks = await Snack.find({
        dayPlanId: dayPlan._id,
      })
        .sort({ type: 1 })
        .lean();

      return {
        ...dayPlan,
        meals,
        snacks,
      };
    })
  );

  const weekPlanWithDays = {
    ...weekPlan,
    days: daysWithDetails,
  };

  // Serialize all MongoDB ObjectIds to strings for client component
  const serializedPlan = serializeMongoDoc(weekPlanWithDays);

  // Pass data to client component for interactivity
  return <MealPlanClient weekPlan={serializedPlan} />;
}
