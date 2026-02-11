'use client';

import { useState } from 'react';

interface RestrictionsInputProps {
  value: string[];
  onChange: (restrictions: string[]) => void;
  error?: string;
}

const PRESET_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Nut allergy',
  'Shellfish allergy',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Halal',
  'Kosher',
];

export default function RestrictionsInput({ value, onChange, error }: RestrictionsInputProps) {
  const [customRestriction, setCustomRestriction] = useState('');

  const handleToggle = (restriction: string) => {
    if (value.includes(restriction)) {
      onChange(value.filter((r) => r !== restriction));
    } else {
      onChange([...value, restriction]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customRestriction.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomRestriction('');
    }
  };

  const handleRemoveCustom = (restriction: string) => {
    onChange(value.filter((r) => r !== restriction));
  };

  // Separate preset and custom restrictions
  const selectedPresets = value.filter((r) => PRESET_RESTRICTIONS.includes(r));
  const customRestrictions = value.filter((r) => !PRESET_RESTRICTIONS.includes(r));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Dietary Restrictions</h3>
      <p className="text-sm text-base-content/70">
        Select any dietary restrictions or allergi es (optional)
      </p>

      {/* Preset Checkboxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PRESET_RESTRICTIONS.map((restriction) => (
          <label key={restriction} className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={selectedPresets.includes(restriction)}
              onChange={() => handleToggle(restriction)}
            />
            <span className="label-text">{restriction}</span>
          </label>
        ))}
      </div>

      {/* Custom Restrictions */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Other Restrictions</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., No onions, Low sodium"
            className={`input input-bordered flex-1 ${error ? 'input-error' : ''}`}
            value={customRestriction}
            onChange={(e) => setCustomRestriction(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddCustom}
            disabled={!customRestriction.trim()}
          >
            Add
          </button>
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>

      {/* Display Custom Restrictions */}
      {customRestrictions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customRestrictions.map((restriction) => (
            <div key={restriction} className="badge badge-lg badge-primary gap-2">
              {restriction}
              <button
                type="button"
                className="btn btn-ghost btn-xs btn-circle"
                onClick={() => handleRemoveCustom(restriction)}
                aria-label={`Remove ${restriction}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Selected Count */}
      {value.length > 0 && (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            {value.length} restriction{value.length !== 1 ? 's' : ''} selected. The AI will never
            suggest foods that violate these.
          </span>
        </div>
      )}
    </div>
  );
}
