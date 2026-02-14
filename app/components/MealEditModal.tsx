// Modal component for editing a specific meal

'use client';

import { useState } from 'react';
import { Meal } from '@/lib/types';

interface MealEditModalProps {
  meal: Meal;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mealId: string, instruction: string) => Promise<void>;
}

export default function MealEditModal({
  meal,
  isOpen,
  onClose,
  onSubmit,
}: MealEditModalProps) {
  const [instruction, setInstruction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!instruction.trim()) {
      setError('Please enter an edit instruction');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(meal.id, instruction.trim());
      setInstruction('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to edit meal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setInstruction('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Format meal type for display
  const mealTypeDisplay = meal.type.charAt(0).toUpperCase() + meal.type.slice(1);

  // Example instructions
  const examples = [
    'Make it vegetarian',
    'Use less oil and make it lower calorie',
    'Replace chicken with fish',
    'Add more vegetables',
    'Make it spicier',
    'Use ingredients from Mediterranean cuisine',
  ];

  return (
    <>
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Modal dialog */}
      <div className="modal modal-open z-50">
        <div className="modal-box max-w-2xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-2xl">Edit {mealTypeDisplay}</h3>
              <p className="text-sm opacity-70 mt-1">{meal.name}</p>
            </div>
            {!isSubmitting && (
              <button
                onClick={handleClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            )}
          </div>

          {/* Current meal summary */}
          <div className="bg-base-200 rounded-lg p-4 mb-4">
            <div className="text-sm">
              <div className="font-semibold mb-2">Current Meal:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="opacity-70">Calories:</span>{' '}
                  {Math.round(meal.macros.calories)} kcal
                </div>
                <div>
                  <span className="opacity-70">Protein:</span>{' '}
                  {Math.round(meal.macros.protein)}g
                </div>
              </div>
              <div className="mt-2 text-xs opacity-60">
                Main ingredients: {meal.ingredients.slice(0, 3).map((i) => i.name).join(', ')}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label mb-3">
                <span className="label-text font-semibold">
                  How would you like to modify this meal?
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="E.g., Make it vegetarian, reduce calories, use different protein..."
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  Be specific about what you'd like to change
                </span>
              </label>
            </div>

            {/* Examples */}
            <div className="mt-3">
              <div className="text-xs font-semibold opacity-70 mb-2">
                Example instructions:
              </div>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInstruction(example)}
                    className="badge badge-outline badge-sm cursor-pointer hover:badge-primary"
                    disabled={isSubmitting}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="modal-action">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting || !instruction.trim()}
              >
                {isSubmitting ? 'Regenerating...' : 'Regenerate Meal'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-4 text-xs opacity-60 bg-info/10 p-3 rounded">
            <p>
              💡 The AI will maintain similar calorie counts and respect your dietary
              restrictions while applying your changes.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
