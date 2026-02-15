"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MealCard from "@/app/components/MealCard";

interface MealPlanClientProps {
  weekPlan: any;
}

export default function MealPlanClient({ weekPlan }: MealPlanClientProps) {
  const router = useRouter();
  const [editingMealId, setEditingMealId] = useState<string | null>(null);

  // Calculate total macros for the week
  const weekTotals = weekPlan.days.reduce(
    (acc: any, day: any) => ({
      calories: acc.calories + day.dailyTotals.calories,
      protein: acc.protein + day.dailyTotals.protein,
      carbs: acc.carbs + day.dailyTotals.carbs,
      fat: acc.fat + day.dailyTotals.fat,
      fiber: acc.fiber + day.dailyTotals.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );

  const weekAverages = {
    calories: Math.round(weekTotals.calories / 7),
    protein: Math.round(weekTotals.protein / 7),
    carbs: Math.round(weekTotals.carbs / 7),
    fat: Math.round(weekTotals.fat / 7),
    fiber: Math.round(weekTotals.fiber / 7),
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Combine and sort meals and snacks chronologically
  const getMealsForDay = (day: any) => {
    const mealOrder = {
      breakfast: 1,
      morning_snack: 2,
      lunch: 3,
      afternoon_snack: 4,
      dinner: 5,
      evening_snack: 6,
    };

    const allItems = [
      ...day.meals.map((m: any) => ({ ...m, isSnack: false })),
      ...day.snacks.map((s: any) => ({ ...s, isSnack: true })),
    ];

    return allItems.sort(
      (a, b) => mealOrder[a.type as keyof typeof mealOrder] - mealOrder[b.type as keyof typeof mealOrder]
    );
  };

  return (
    <div className="min-h-screen p-8 bg-base-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">Your Meal Plan</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="btn btn-ghost"
              >
                Dashboard
              </button>
              <button
                onClick={() => window.print()}
                className="btn btn-outline"
              >
                Print
              </button>
            </div>
          </div>

          {/* Week overview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title">Week Summary</h2>
                {weekPlan.status === "incomplete" && (
                  <span className="badge badge-warning">1-Day Test Plan</span>
                )}
              </div>
              <p className="text-sm text-base-content/70">
                {formatDate(weekPlan.startDate)} - {formatDate(weekPlan.endDate)}
              </p>
              <p className="text-sm">
                Goal: <span className="font-semibold">{weekPlan.primaryGoal.replace(/_/g, " ")}</span>
              </p>
              {weekPlan.status === "incomplete" && (
                <div className="alert alert-info mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm">This is a 1-day test plan for testing MongoDB integration. Full 7-day plans coming soon!</span>
                </div>
              )}

              {/* Daily averages */}
              <div className="grid grid-cols-5 gap-4 mt-4">
                <div className="stat p-4">
                  <div className="stat-title text-xs">Avg Calories</div>
                  <div className="stat-value text-2xl">{weekAverages.calories}</div>
                </div>
                <div className="stat p-4">
                  <div className="stat-title text-xs">Avg Protein</div>
                  <div className="stat-value text-2xl">{weekAverages.protein}g</div>
                </div>
                <div className="stat p-4">
                  <div className="stat-title text-xs">Avg Carbs</div>
                  <div className="stat-value text-2xl">{weekAverages.carbs}g</div>
                </div>
                <div className="stat p-4">
                  <div className="stat-title text-xs">Avg Fat</div>
                  <div className="stat-value text-2xl">{weekAverages.fat}g</div>
                </div>
                <div className="stat p-4">
                  <div className="stat-title text-xs">Avg Fiber</div>
                  <div className="stat-value text-2xl">{weekAverages.fiber}g</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Days */}
        {weekPlan.days.map((day: any, dayIndex: number) => {
          const mealsAndSnacks = getMealsForDay(day);

          return (
            <div key={day._id} className="mb-8">
              {/* Day header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Day {dayIndex + 1} - {formatDate(day.date)}
                </h2>
                <div className="badge badge-lg">
                  {day.dailyTotals.calories} cal
                </div>
              </div>

              {/* Meals and snacks */}
              <div className="grid gap-4">
                {mealsAndSnacks.map((item: any) => (
                  <MealCard
                    key={item._id}
                    meal={item}
                    isSnack={item.isSnack}
                    onEdit={() => setEditingMealId(item._id)}
                  />
                ))}
              </div>

              {/* Daily totals */}
              <div className="card bg-base-100 shadow mt-4">
                <div className="card-body p-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Daily Totals:</span>
                    <span>
                      {day.dailyTotals.calories} cal | {day.dailyTotals.protein}g protein |{" "}
                      {day.dailyTotals.carbs}g carbs | {day.dailyTotals.fat}g fat |{" "}
                      {day.dailyTotals.fiber}g fiber
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
