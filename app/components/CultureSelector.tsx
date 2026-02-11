'use client';

import { useState } from 'react';
import { CulturalContext } from '@/lib/types';

interface CultureSelectorProps {
  value: CulturalContext;
  onChange: (context: CulturalContext) => void;
  errors?: {
    cuisine?: string;
    location?: string;
  };
}

const CUISINES = [
  'Mediterranean',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Vietnamese',
  'Middle Eastern',
  'Greek',
  'French',
  'Spanish',
  'Korean',
  'Brazilian',
  'Caribbean',
  'American',
  'British',
  'German',
  'Scandinavian',
  'African',
  'Other',
];

export default function CultureSelector({ value, onChange, errors }: CultureSelectorProps) {
  const [showCustomCuisine, setShowCustomCuisine] = useState(
    value.cuisine && !CUISINES.includes(value.cuisine)
  );

  const handleCuisineChange = (cuisine: string) => {
    if (cuisine === 'Other') {
      setShowCustomCuisine(true);
      onChange({ ...value, cuisine: '' });
    } else {
      setShowCustomCuisine(false);
      onChange({ ...value, cuisine });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Cultural Preferences</h3>

      {/* Cuisine Preference */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Preferred Cuisine</span>
        </label>
        <select
          className={`select select-bordered w-full ${errors?.cuisine ? 'select-error' : ''}`}
          value={showCustomCuisine ? 'Other' : value.cuisine}
          onChange={(e) => handleCuisineChange(e.target.value)}
        >
          <option value="" disabled>
            Select cuisine
          </option>
          {CUISINES.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        {errors?.cuisine && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.cuisine}</span>
          </label>
        )}
      </div>

      {/* Custom Cuisine Input */}
      {showCustomCuisine && (
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Custom Cuisine</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Fusion, Ethiopian, Polish"
            className="input input-bordered w-full"
            value={value.cuisine}
            onChange={(e) => onChange({ ...value, cuisine: e.target.value })}
          />
          <label className="label">
            <span className="label-text-alt text-xs opacity-70">
              Enter your preferred cuisine type
            </span>
          </label>
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
