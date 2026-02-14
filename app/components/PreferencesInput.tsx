'use client';

import { useState } from 'react';
import Pill from '@/app/components/design-system/Pill';

interface PreferencesInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  errors?: string;
}

const MAX_PREFERENCE_LENGTH = 50;

export default function PreferencesInput({ value, onChange, errors }: PreferencesInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();

    // Validate
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      alert('This preference is already in your list');
      return;
    }
    if (trimmed.length > MAX_PREFERENCE_LENGTH) {
      alert(`Preference is too long. Maximum ${MAX_PREFERENCE_LENGTH} characters.`);
      return;
    }

    // Add to list
    onChange([...value, trimmed]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (preferenceToRemove: string) => {
    onChange(value.filter((p) => p !== preferenceToRemove));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Food Preferences</h3>

      {/* Input with Add Button */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Foods to Avoid (Optional)</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., mushrooms, cilantro, eggplant"
            className={`input input-bordered flex-1 ${errors ? 'input-error' : ''}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_PREFERENCE_LENGTH}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary"
            disabled={!inputValue.trim()}
          >
            Add
          </button>
        </div>
        {errors && (
          <label className="label">
            <span className="label-text-alt text-error">{errors}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-xs opacity-70">
            What foods or ingredients do you prefer to avoid? AI will try to avoid these when possible.
          </span>
        </label>
      </div>

      {/* Display Preferences as Pills */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((preference) => {
            const displayText = preference.length > MAX_PREFERENCE_LENGTH
              ? `${preference.substring(0, MAX_PREFERENCE_LENGTH)}...`
              : preference;

            return (
              <Pill
                key={preference}
                text={displayText}
                onRemove={() => handleRemove(preference)}
              />
            );
          })}
        </div>
      )}

      {value.length === 0 && (
        <p className="text-sm text-base-content opacity-50">
          No food preferences added. You can skip this if you don't have any.
        </p>
      )}
    </div>
  );
}
