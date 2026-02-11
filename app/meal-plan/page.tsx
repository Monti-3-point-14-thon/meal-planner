// Meal plan page - Display and edit meal plan

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMealPlan, getSettings, saveMealPlan } from '@/lib/storage';
import { MealPlan, UserSettings, Meal } from '@/lib/types';
import MealPlanView from '@/app/components/MealPlanView';
import MealEditModal from '@/app/components/MealEditModal';
import SnackGenerationModal, { SnackPreferences } from '@/app/components/SnackGenerationModal';

export default function MealPlanPage() {
  const router = useRouter();
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSnackModalOpen, setIsSnackModalOpen] = useState(false);

  useEffect(() => {
    // Load meal plan and settings from localStorage
    const plan = getMealPlan();
    const userSettings = getSettings();

    if (!plan) {
      // No meal plan found, redirect to generation
      router.push('/generate');
      return;
    }

    setMealPlan(plan);
    setSettings(userSettings);
    setLoading(false);
  }, [router]);

  const handleEditMeal = (mealId: string) => {
    setEditingMealId(mealId);
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = async (mealId: string, instruction: string) => {
    if (!mealPlan || !settings) return;

    // Find the meal to edit
    const mealToEdit = mealPlan.meals.find((m) => m.id === mealId);
    if (!mealToEdit) {
      throw new Error('Meal not found');
    }

    // Call API to regenerate meal
    const response = await fetch('/api/edit-meal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meal: mealToEdit,
        editInstruction: instruction,
        settings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to edit meal');
    }

    const data = await response.json();

    if (!data.success || !data.meal) {
      throw new Error('Invalid response from server');
    }

    // Update meal in meal plan
    const updatedMeals = mealPlan.meals.map((m) =>
      m.id === mealId ? data.meal : m
    );

    // Recalculate daily totals
    const updatedDailyTotals = calculateDailyTotals(updatedMeals);

    // Create updated meal plan
    const updatedMealPlan: MealPlan = {
      ...mealPlan,
      meals: updatedMeals,
      daily_totals: updatedDailyTotals,
    };

    // Update state and localStorage
    setMealPlan(updatedMealPlan);
    saveMealPlan(updatedMealPlan);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingMealId(null);
  };

  const handleUndoEdit = (mealId: string) => {
    if (!mealPlan) return;

    // Find the meal
    const meal = mealPlan.meals.find((m) => m.id === mealId);
    if (!meal || !meal.edit_history || meal.edit_history.length === 0) {
      return;
    }

    // Get the last edit to restore previous state
    const lastEdit = meal.edit_history[meal.edit_history.length - 1];

    // Restore previous name and macros (simple undo for MVP)
    // Note: This doesn't restore ingredients/instructions which would require full meal state storage
    const restoredMeal: Meal = {
      ...meal,
      name: lastEdit.previous_name,
      macros: lastEdit.previous_macros,
      edit_history: meal.edit_history.slice(0, -1), // Remove last edit
    };

    // Update meal in meal plan
    const updatedMeals = mealPlan.meals.map((m) =>
      m.id === mealId ? restoredMeal : m
    );

    // Recalculate daily totals
    const updatedDailyTotals = calculateDailyTotals(updatedMeals);

    // Create updated meal plan
    const updatedMealPlan: MealPlan = {
      ...mealPlan,
      meals: updatedMeals,
      daily_totals: updatedDailyTotals,
    };

    // Update state and localStorage
    setMealPlan(updatedMealPlan);
    saveMealPlan(updatedMealPlan);

    // Note: For full undo functionality, we'd need to store complete previous meal state
    // This MVP version restores name and macros but ingredients/instructions remain current
    alert('Edit undone! Note: Ingredients list remains from edited version (full undo coming soon).');
  };

  const handleAddSnack = () => {
    setIsSnackModalOpen(true);
  };

  const handleGenerateSnack = async (preferences: SnackPreferences) => {
    if (!mealPlan || !settings) {
      throw new Error('No meal plan or settings available');
    }

    // Call API to generate snack
    const response = await fetch('/api/generate-snack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        settings,
        preferences,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate snack');
    }

    const data = await response.json();

    if (!data.success || !data.snack) {
      throw new Error('Invalid response from server');
    }

    // Add snack to meal plan
    const updatedMeals = [...mealPlan.meals, data.snack];

    // Recalculate daily totals
    const updatedDailyTotals = calculateDailyTotals(updatedMeals);

    // Create updated meal plan
    const updatedMealPlan: MealPlan = {
      ...mealPlan,
      meals: updatedMeals,
      daily_totals: updatedDailyTotals,
    };

    // Update state and localStorage
    setMealPlan(updatedMealPlan);
    saveMealPlan(updatedMealPlan);
  };

  const handleCloseSnackModal = () => {
    setIsSnackModalOpen(false);
  };

  // Get the meal being edited
  const editingMeal = editingMealId
    ? mealPlan?.meals.find((m) => m.id === editingMealId)
    : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold">No Meal Plan Found</h1>
            <p className="py-6">Let's create your personalized meal plan!</p>
            <button
              onClick={() => router.push('/settings')}
              className="btn btn-primary"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate target calories from settings (if available)
  const targetCalories = settings
    ? calculateTargetCalories(settings)
    : undefined;

  return (
    <>
      <div className="container mx-auto p-4 max-w-4xl">
        <MealPlanView
          mealPlan={mealPlan}
          targetCalories={targetCalories}
          onEditMeal={handleEditMeal}
          onUndoEdit={handleUndoEdit}
          onAddSnack={handleAddSnack}
        />
      </div>

      {/* Edit Modal */}
      {editingMeal && (
        <MealEditModal
          meal={editingMeal}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitEdit}
        />
      )}

      {/* Snack Generation Modal */}
      <SnackGenerationModal
        isOpen={isSnackModalOpen}
        onClose={handleCloseSnackModal}
        onGenerate={handleGenerateSnack}
      />
    </>
  );
}

/**
 * Calculate daily totals from meals
 */
function calculateDailyTotals(meals: Meal[]) {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.macros.calories,
      protein: totals.protein + meal.macros.protein,
      carbs: totals.carbs + meal.macros.carbs,
      fat: totals.fat + meal.macros.fat,
      fiber: totals.fiber + meal.macros.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/**
 * Calculate target calories (simplified version of prompts.ts logic)
 */
function calculateTargetCalories(settings: UserSettings): number {
  const { biometrics, primary_goal } = settings;
  const { weight, height, age, sex } = biometrics;

  // BMR using Mifflin-St Jeor
  const bmr =
    sex === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // TDEE (moderate activity)
  const tdee = bmr * 1.5;

  // Adjust for goal
  switch (primary_goal) {
    case 'muscle_building':
      return Math.round(tdee + 300);
    case 'weight_loss':
      return Math.round(tdee - 500);
    default:
      return Math.round(tdee);
  }
}
