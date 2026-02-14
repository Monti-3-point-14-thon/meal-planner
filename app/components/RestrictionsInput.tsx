'use client';

import MultiSelectDropdown from '@/app/components/design-system/MultiSelectDropdown';
import Pill from '@/app/components/design-system/Pill';

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
];

export default function RestrictionsInput({ value, onChange, error }: RestrictionsInputProps) {
  const restrictionOptions = PRESET_RESTRICTIONS.map((restriction) => ({
    value: restriction,
    label: restriction,
  }));

  const handleRemove = (restrictionToRemove: string) => {
    onChange(value.filter((r) => r !== restrictionToRemove));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Dietary Restrictions</h3>

      {/* Multi-Select Dropdown */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Allergies & Strict Requirements</span>
        </label>
        <MultiSelectDropdown
          options={restrictionOptions}
          selected={value}
          onChange={onChange}
          placeholder="Select restrictions (optional)"
          error={error}
        />
        <label className="label">
          <span className="label-text-alt text-xs opacity-70">
            Allergies and strict dietary requirements. AI will <strong>NEVER</strong> violate these.
          </span>
        </label>
      </div>

      {/* Display Selected Restrictions as Pills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((restriction) => (
            <Pill
              key={restriction}
              text={restriction}
              onRemove={() => handleRemove(restriction)}
            />
          ))}
        </div>
      )}

      {/* Info Alert */}
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

      {value.length === 0 && (
        <p className="text-sm text-base-content opacity-50">
          No dietary restrictions added. You can skip this if you don't have any.
        </p>
      )}
    </div>
  );
}
