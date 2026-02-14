'use client';

import { useEffect } from 'react';
import { CulturalContext } from '@/lib/types';
import MultiSelectDropdown from '@/app/components/design-system/MultiSelectDropdown';
import Pill from '@/app/components/design-system/Pill';
import FlagIcon from '@/app/components/design-system/FlagIcon';

interface CultureSelectorProps {
  value: CulturalContext;
  onChange: (context: CulturalContext) => void;
  errors?: {
    cuisines?: string;
    location?: string;
  };
}

const CUISINES = [
  'Italian',
  'Mexican',
  'Japanese',
  'Chinese',
  'Indian',
  'Mediterranean',
  'American',
  'French',
  'Thai',
  'Vietnamese',
  'Korean',
  'Middle Eastern',
  'Caribbean',
  'African',
  'Greek',
  'Spanish',
  'Brazilian',
  'British',
  'German',
  'Scandinavian',
  'Other',
];

export default function CultureSelector({ value, onChange, errors }: CultureSelectorProps) {
  // Backwards-compatible migration: convert old single cuisine to array
  useEffect(() => {
    // Check if old format exists (single cuisine string property)
    const oldValue = value as any;
    if (oldValue.cuisine && typeof oldValue.cuisine === 'string') {
      console.warn('⚠️ Migrating old cuisine format to new cuisines array format');
      onChange({
        location: value.location,
        cuisines: [oldValue.cuisine],
      });
    }
  }, []);

  const cuisineOptions = CUISINES.map((cuisine) => ({
    value: cuisine,
    label: cuisine,
  }));

  const handleCuisinesChange = (selected: string[]) => {
    onChange({ ...value, cuisines: selected });
  };

  const handleRemoveCuisine = (cuisineToRemove: string) => {
    const updated = value.cuisines.filter((c) => c !== cuisineToRemove);
    onChange({ ...value, cuisines: updated });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Cultural Preferences</h3>

      {/* Cuisine Preferences (Multi-Select) */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Preferred Cuisines</span>
        </label>
        <MultiSelectDropdown
          options={cuisineOptions}
          selected={value.cuisines || []}
          onChange={handleCuisinesChange}
          placeholder="Select cuisines"
          error={errors?.cuisines}
        />
        <label className="label">
          <span className="label-text-alt text-xs opacity-70">
            Select one or more cuisine types you enjoy
          </span>
        </label>
      </div>

      {/* Selected Cuisines as Pills */}
      {value.cuisines && value.cuisines.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.cuisines.map((cuisine) => (
            <Pill
              key={cuisine}
              text={cuisine}
              icon={<FlagIcon cuisine={cuisine} />}
              onRemove={() => handleRemoveCuisine(cuisine)}
            />
          ))}
        </div>
      )}

      {/* Location */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <input
          type="text"
          placeholder="e.g., United States, London, Tokyo"
          className={`input input-bordered w-full ${errors?.location ? 'input-error' : ''}`}
          value={value.location}
          onChange={(e) => onChange({ ...value, location: e.target.value })}
        />
        {errors?.location && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.location}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-xs opacity-70">
            Helps suggest locally-available ingredients
          </span>
        </label>
      </div>
    </div>
  );
}
