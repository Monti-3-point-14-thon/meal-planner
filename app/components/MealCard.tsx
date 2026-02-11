// Component to display a single meal with edit capability

import { Meal } from '@/lib/types';
import MacroDisplay from './MacroDisplay';

interface MealCardProps {
  meal: Meal;
  onEdit: (mealId: string) => void;
  onUndo?: (mealId: string) => void;
}

export default function MealCard({ meal, onEdit, onUndo }: MealCardProps) {
  // Format meal type for display
  const mealTypeDisplay = meal.type.charAt(0).toUpperCase() + meal.type.slice(1);

  // Check if meal has been edited
  const hasEditHistory = meal.edit_history && meal.edit_history.length > 0;
  const lastEdit = hasEditHistory ? meal.edit_history[meal.edit_history.length - 1] : null;

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        {/* Header with meal type and edit button */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-sm opacity-60 uppercase tracking-wide">
              {mealTypeDisplay}
            </div>
            <h3 className="card-title text-xl mt-1">{meal.name}</h3>
          </div>
          <button
            onClick={() => onEdit(meal.id)}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Edit meal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>

        {/* Macros */}
        <div className="mt-3">
          <MacroDisplay macros={meal.macros} size="md" />
        </div>

        {/* Nutritional Reasoning */}
        <div className="mt-4">
          <div className="text-sm font-semibold opacity-70 mb-1">
            Why this meal?
          </div>
          <p className="text-sm leading-relaxed">{meal.nutritional_reasoning}</p>
          {meal.scientific_sources && meal.scientific_sources.length > 0 && (
            <div className="mt-2">
              <details className="collapse collapse-arrow bg-base-200 rounded-lg">
                <summary className="collapse-title text-xs font-medium">
                  Scientific Sources ({meal.scientific_sources.length})
                </summary>
                <div className="collapse-content text-xs">
                  <ul className="list-disc list-inside space-y-1">
                    {meal.scientific_sources.map((source, idx) => (
                      <li key={idx}>
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link link-primary"
                        >
                          Source {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="mt-4">
          <div className="text-sm font-semibold opacity-70 mb-2">
            Ingredients
          </div>
          <div className="grid grid-cols-1 gap-1">
            {meal.ingredients.map((ingredient, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm py-1 border-b border-base-300 last:border-0"
              >
                <span>{ingredient.name}</span>
                <span className="opacity-60">{ingredient.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {meal.instructions && (
          <div className="mt-4">
            <div className="text-sm font-semibold opacity-70 mb-1">
              Instructions
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              {meal.instructions}
            </p>
          </div>
        )}

        {/* Prep Time */}
        <div className="mt-3 flex items-center gap-2 text-xs opacity-60">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Prep time: {meal.prep_time_minutes} minutes</span>
        </div>

        {/* Edit History & Undo */}
        {hasEditHistory && lastEdit && (
          <div className="mt-4 pt-4 border-t border-base-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs opacity-70 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Edited {meal.edit_history.length} time{meal.edit_history.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-xs bg-base-200 rounded p-2 mt-1">
                  <span className="opacity-70">Last change:</span> "{lastEdit.instruction}"
                </div>
              </div>
              {onUndo && (
                <button
                  onClick={() => onUndo(meal.id)}
                  className="btn btn-outline btn-sm btn-error"
                  title="Undo last edit and restore previous version"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Undo
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
