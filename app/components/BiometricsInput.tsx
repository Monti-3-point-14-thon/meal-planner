'use client';

import { useState, useEffect } from 'react';
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
  const [showSexMigrationAlert, setShowSexMigrationAlert] = useState(false);

  // Check for old "other" sex value on mount
  useEffect(() => {
    const oldValue = value as any;
    if (oldValue.sex === 'other') {
      setShowSexMigrationAlert(true);
    }
  }, []);

  const handleWeightChange = (inputValue: string) => {
    // Strip non-digits
    const digitsOnly = inputValue.replace(/[^\d]/g, '');
    const numValue = parseInt(digitsOnly);
    if (isNaN(numValue) || digitsOnly === '') {
      onChange({ ...value, weight: 0 });
      return;
    }

    // Convert to kg for storage
    const weightInKg = weightUnit === 'lbs' ? Math.round(numValue * 0.453592) : numValue;
    onChange({ ...value, weight: weightInKg });
  };

  const handleHeightChange = (inputValue: string) => {
    // Strip non-digits
    const digitsOnly = inputValue.replace(/[^\d]/g, '');
    const numValue = parseInt(digitsOnly);
    if (isNaN(numValue) || digitsOnly === '') {
      onChange({ ...value, height: 0 });
      return;
    }

    // Convert to cm for storage
    const heightInCm = heightUnit === 'inches' ? Math.round(numValue * 2.54) : numValue;
    onChange({ ...value, height: heightInCm });
  };

  const displayWeight = weightUnit === 'lbs' ? Math.round(value.weight * 2.20462) : value.weight;
  const displayHeight = heightUnit === 'inches' ? Math.round(value.height / 2.54) : value.height;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Your Biometrics</h3>

      {/* Sex Migration Alert */}
      {showSexMigrationAlert && (
        <div className="alert alert-warning">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            Please select Male or Female for biological sex. This is required for accurate calorie calculations.
          </span>
        </div>
      )}

      {/* Weight */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Weight</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder={weightUnit === 'kg' ? '70' : '154'}
            className={`input input-bordered flex-1 ${errors?.weight ? 'input-error' : ''}`}
            value={displayWeight > 0 ? displayWeight : ''}
            onChange={(e) => handleWeightChange(e.target.value)}
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
            type="text"
            inputMode="numeric"
            placeholder={heightUnit === 'cm' ? '170' : '67'}
            className={`input input-bordered flex-1 ${errors?.height ? 'input-error' : ''}`}
            value={displayHeight > 0 ? displayHeight : ''}
            onChange={(e) => handleHeightChange(e.target.value)}
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
          onChange={(e) => {
            onChange({ ...value, sex: e.target.value as Sex });
            setShowSexMigrationAlert(false);
          }}
        >
          <option value="" disabled>
            Select sex
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
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
