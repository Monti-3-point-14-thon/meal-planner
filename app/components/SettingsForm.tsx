'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { UserSettings, Goal, Biometrics, CulturalContext, Sex } from '@/lib/types';
import { saveSettings } from '@/lib/storage';
import GoalSelector from './GoalSelector';
import BiometricsInput from './BiometricsInput';
import CultureSelector from './CultureSelector';
import PreferencesInput from './PreferencesInput';
import RestrictionsInput from './RestrictionsInput';

interface FormErrors {
  goal?: string;
  biometrics?: {
    weight?: string;
    height?: string;
    age?: string;
    sex?: string;
  };
  cultural?: {
    cuisines?: string;
    location?: string;
  };
}

export default function SettingsForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form state
  const [goal, setGoal] = useState<Goal>('' as Goal);
  const [biometrics, setBiometrics] = useState<Biometrics>({
    weight: 0,
    height: 0,
    age: 0,
    sex: '' as Sex,
  });
  const [cultural, setCultural] = useState<CulturalContext>({
    cuisines: [],
    location: '',
  });
  const [preferences, setPreferences] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate goal
    if (!goal) {
      newErrors.goal = 'Please select a health goal';
    }

    // Validate biometrics
    newErrors.biometrics = {};
    if (biometrics.weight <= 0 || biometrics.weight > 300) {
      newErrors.biometrics.weight = 'Please enter a valid weight (20-300 kg)';
    }
    if (biometrics.height <= 0 || biometrics.height > 250) {
      newErrors.biometrics.height = 'Please enter a valid height (100-250 cm)';
    }
    if (biometrics.age < 13 || biometrics.age > 120) {
      newErrors.biometrics.age = 'Please enter a valid age (13-120)';
    }
    if (!biometrics.sex) {
      newErrors.biometrics.sex = 'Please select biological sex';
    }

    // Validate cultural context
    newErrors.cultural = {};
    if (!cultural.cuisines || cultural.cuisines.length === 0) {
      newErrors.cultural.cuisines = 'Please select at least one cuisine preference';
    }
    if (!cultural.location) {
      newErrors.cultural.location = 'Please enter your location';
    }

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors =
      !!newErrors.goal ||
      Object.values(newErrors.biometrics || {}).some((e) => !!e) ||
      Object.values(newErrors.cultural || {}).some((e) => !!e);

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create UserSettings object
      const settings: UserSettings = {
        id: uuidv4(),
        primary_goal: goal,
        biometrics,
        cultural_context: cultural,
        food_preferences: {
          dislikes: preferences,
        },
        dietary_restrictions: restrictions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      saveSettings(settings);

      // Navigate to generation page
      router.push('/generate');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Goal Selection */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <GoalSelector value={goal} onChange={setGoal} error={errors.goal} />
        </div>
      </div>

      {/* Biometrics */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <BiometricsInput value={biometrics} onChange={setBiometrics} errors={errors.biometrics} />
        </div>
      </div>

      {/* Cultural Preferences */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <CultureSelector value={cultural} onChange={setCultural} errors={errors.cultural} />
        </div>
      </div>

      {/* Food Preferences */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <PreferencesInput value={preferences} onChange={setPreferences} />
        </div>
      </div>

      {/* Dietary Restrictions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <RestrictionsInput value={restrictions} onChange={setRestrictions} />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className={`btn btn-primary btn-lg ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Generate My Meal Plan'}
        </button>
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-base-content/70">
        <p>Your information is stored locally in your browser.</p>
        <p>We use it only to personalize your meal plan.</p>
      </div>
    </form>
  );
}
