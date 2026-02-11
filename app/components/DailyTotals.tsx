// Component to display daily macronutrient totals

import { Macros } from '@/lib/types';
import MacroDisplay from './MacroDisplay';

interface DailyTotalsProps {
  totals: Macros;
  targetCalories?: number;
}

export default function DailyTotals({
  totals,
  targetCalories,
}: DailyTotalsProps) {
  // Calculate percentage of target calories if provided
  const caloriePercentage = targetCalories
    ? Math.round((totals.calories / targetCalories) * 100)
    : null;

  // Determine if we're on target (within 5%)
  const onTarget =
    caloriePercentage && caloriePercentage >= 95 && caloriePercentage <= 105;

  return (
    <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-2xl">Daily Totals</h3>

        {/* Target comparison */}
        {targetCalories && (
          <div className="flex items-center gap-2 text-sm mb-2">
            <span>Target: {targetCalories} kcal</span>
            <span className="opacity-70">•</span>
            <span
              className={`font-semibold ${
                onTarget
                  ? 'text-success'
                  : caloriePercentage! > 105
                  ? 'text-warning'
                  : 'text-info'
              }`}
            >
              {caloriePercentage}% of target
            </span>
            {onTarget && (
              <span className="badge badge-success badge-sm">On Target!</span>
            )}
          </div>
        )}

        {/* Macro display with larger size */}
        <MacroDisplay macros={totals} size="lg" />

        {/* Macro breakdown percentages */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold">Protein</div>
            <div className="opacity-80">
              {calculateMacroPercentage(totals.protein * 4, totals.calories)}%
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Carbs</div>
            <div className="opacity-80">
              {calculateMacroPercentage(totals.carbs * 4, totals.calories)}%
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Fat</div>
            <div className="opacity-80">
              {calculateMacroPercentage(totals.fat * 9, totals.calories)}%
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-3 text-xs opacity-80">
          <p>
            This meal plan provides a balanced distribution of macronutrients to
            support your health goals.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate percentage of total calories from a macronutrient
 */
function calculateMacroPercentage(
  macroCalories: number,
  totalCalories: number
): number {
  if (totalCalories === 0) return 0;
  return Math.round((macroCalories / totalCalories) * 100);
}
