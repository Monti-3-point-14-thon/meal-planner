'use client';

import { useState } from 'react';
import { Biometrics, Sex } from '@/lib/types';

interface BiometricsInputProps {
  value: Biometrics;
  onChange: (biometrics: Biometrics) => void;
  errors?: {
    weight?: string;
    height?: string;
    age?: string;
    sex?: string;
  };
}

export default function BiometricsInput({ value, onChange, errors }: BiometricsInputProps) {
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'inches'>('cm');

  const handleWeightChange = (inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return;

    // Convert to kg for storage
    const weightInKg = weightUnit === 'lbs' ? numValue * 0.453592 : numValue;
    onChange({ ...value, weight: weightInKg });
  };

  const handleHeightChange = (inputValue: string) => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) return;

    // Convert to cm for storage
    const heightInCm = heightUnit === 'inches' ? numValue * 2.54 : numValue;
    onChange({ ...value, height: heightInCm });
  };

  const displayWeight = weightUnit === 'lbs' ? value.weight * 2.20462 : value.weight;
  const displayHeight = heightUnit === 'inches' ? value.height / 2.54 : value.height;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Your Biometrics</h3>

      {/* Weight */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Weight</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={weightUnit === 'kg' ? '70' : '154'}
            className={`input input-bordered flex-1 ${errors?.weight ? 'input-error' : ''}`}
            value={displayWeight > 0 ? displayWeight.toFixed(1) : ''}
            onChange={(e) => handleWeightChange(e.target.value)}
            min="20"
            max="300"
            step="0.1"
          />
          <div className="join">
            <button
              type="button"
              className={`btn join-item ${weightUnit === 'kg' ? 'btn-active' : ''}`}
              onClick={() => setWeightUnit('kg')}
            >
              kg
            </button>
            <button
              type="button"
              className={`btn join-item ${weightUnit === 'lbs' ? 'btn-active' : ''}`}
              onClick={() => setWeightUnit('lbs')}
            >
              lbs
            </button>
          </div>
        </div>
        {errors?.weight && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.weight}</span>
          </label>
        )}
      </div>

      {/* Height */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Height</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={heightUnit === 'cm' ? '170' : '67'}
            className={`input input-bordered flex-1 ${errors?.height ? 'input-error' : ''}`}
            value={displayHeight > 0 ? displayHeight.toFixed(1) : ''}
            onChange={(e) => handleHeightChange(e.target.value)}
            min="100"
            max="250"
            step="0.1"
          />
          <div className="join">
            <button
              type="button"
              className={`btn join-item ${heightUnit === 'cm' ? 'btn-active' : ''}`}
              onClick={() => setHeightUnit('cm')}
            >
              cm
            </button>
            <button
              type="button"
              className={`btn join-item ${heightUnit === 'inches' ? 'btn-active' : ''}`}
              onClick={() => setHeightUnit('inches')}
            >
              in
            </button>
          </div>
        </div>
        {errors?.height && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.height}</span>
          </label>
        )}
      </div>

      {/* Age */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Age</span>
        </label>
        <input
          type="number"
          placeholder="30"
          className={`input input-bordered w-full ${errors?.age ? 'input-error' : ''}`}
          value={value.age > 0 ? value.age : ''}
          onChange={(e) => onChange({ ...value, age: parseInt(e.target.value) || 0 })}
          min="13"
          max="120"
        />
        {errors?.age && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.age}</span>
          </label>
        )}
      </div>

      {/* Sex */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Biological Sex</span>
        </label>
        <select
          className={`select select-bordered w-full ${errors?.sex ? 'select-error' : ''}`}
          value={value.sex}
          onChange={(e) => onChange({ ...value, sex: e.target.value as Sex })}
        >
          <option value="" disabled>
            Select sex
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors?.sex && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.sex}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-xs opacity-70">
            Used for calculating nutritional needs
          </span>
        </label>
      </div>
    </div>
  );
}
