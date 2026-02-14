// Modal component for generating a custom snack

'use client';

import { useState } from 'react';

interface SnackGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (preferences: SnackPreferences) => Promise<void>;
}

export interface SnackPreferences {
  timing: 'morning' | 'afternoon' | 'evening';
  calorieTarget: number;
  preference?: string;
}

export default function SnackGenerationModal({
  isOpen,
  onClose,
  onGenerate,
}: SnackGenerationModalProps) {
  const [timing, setTiming] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [calorieTarget, setCalorieTarget] = useState(200);
  const [preference, setPreference] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsGenerating(true);
    setError(null);

    try {
      await onGenerate({
        timing,
        calorieTarget,
        preference: preference.trim() || undefined,
      });
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to generate snack');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setTiming('afternoon');
    setCalorieTarget(200);
    setPreference('');
    setError(null);
  };

  const handleClose = () => {
    if (!isGenerating) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Modal dialog */}
      <div className="modal modal-open z-50">
        <div className="modal-box">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-2xl">Add a Snack</h3>
            {!isGenerating && (
              <button
                onClick={handleClose}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Timing */}
            <div className="form-control">
              <label className="label mb-3">
                <span className="label-text font-semibold">When?</span>
              </label>
              <select
                className="select select-bordered"
                value={timing}
                onChange={(e) => setTiming(e.target.value as any)}
                disabled={isGenerating}
              >
                <option value="morning">Morning (between breakfast & lunch)</option>
                <option value="afternoon">Afternoon (between lunch & dinner)</option>
                <option value="evening">Evening (after dinner)</option>
              </select>
            </div>

            {/* Calorie Target */}
            <div className="form-control">
              <label className="label mb-3">
                <span className="label-text font-semibold">Calorie Target</span>
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(Number(e.target.value))}
                className="range range-primary"
                disabled={isGenerating}
              />
              <div className="flex justify-between text-xs mt-2">
                <span>50 kcal</span>
                <span className="font-bold text-primary">{calorieTarget} kcal</span>
                <span>500 kcal</span>
              </div>
            </div>

            {/* Preference (optional) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Specific Preferences (optional)
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="E.g., high protein, fruit-based, crunchy..."
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                disabled={isGenerating}
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  Leave empty for AI to decide based on your profile
                </span>
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div className="alert alert-error">
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
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${isGenerating ? 'loading' : ''}`}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Snack'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-4 text-xs opacity-60 bg-info/10 p-3 rounded">
            <p>
              💡 The snack will be personalized to your dietary restrictions and
              health goals.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
