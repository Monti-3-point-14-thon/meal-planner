// Component to display complete meal plan with all meals

'use client';

import { useState } from 'react';
import { MealPlan } from '@/lib/types';
import MealCard from './MealCard';
import DailyTotals from './DailyTotals';

interface MealPlanViewProps {
  mealPlan: MealPlan;
  targetCalories?: number;
  onEditMeal: (mealId: string) => void;
  onUndoEdit?: (mealId: string) => void;
  onAddSnack?: () => void;
}

export default function MealPlanView({
  mealPlan,
  targetCalories,
  onEditMeal,
  onUndoEdit,
  onAddSnack,
}: MealPlanViewProps) {
  // Sort meals by type order (breakfast, lunch, dinner, snack)
  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
  const sortedMeals = [...mealPlan.meals].sort(
    (a, b) => mealOrder.indexOf(a.type) - mealOrder.indexOf(b.type)
  );

  // Format date
  const planDate = new Date(mealPlan.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Your Personalized Meal Plan</h1>
        <p className="text-lg opacity-70 mt-2">{planDate}</p>
      </div>

      {/* Daily Totals at top */}
      <DailyTotals totals={mealPlan.daily_totals} targetCalories={targetCalories} />

      {/* Meals */}
      <div className="space-y-6">
        {sortedMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} onEdit={onEditMeal} onUndo={onUndoEdit} />
        ))}
      </div>

      {/* Add Snack Button */}
      {onAddSnack && (
        <div className="flex justify-center">
          <button onClick={onAddSnack} className="btn btn-outline btn-wide">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Snack
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4 pt-6">
        <button className="btn btn-primary btn-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          Save Meal Plan
        </button>
        <button className="btn btn-outline btn-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button>
      </div>

      {/* Helper text */}
      <div className="text-center text-sm opacity-60 pt-4">
        <p>Click the edit icon on any meal to customize it to your preferences.</p>
      </div>
    </div>
  );
}
