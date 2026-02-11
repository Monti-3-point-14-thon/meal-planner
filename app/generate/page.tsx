// Generation page - triggers meal plan generation and shows loading state

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSettings, saveMealPlan } from '@/lib/storage';
import { MealPlan } from '@/lib/types';
import GenerationLoader from '@/app/components/GenerationLoader';
import ErrorDisplay from '@/app/components/ErrorDisplay';

export default function GeneratePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    generateMealPlan();
  }, []);

  const generateMealPlan = async () => {
    try {
      // Get user settings from localStorage
      const settings = getSettings();

      if (!settings) {
        setError('No user settings found');
        setErrorDetails(
          'Please complete the settings form first before generating a meal plan.'
        );
        return;
      }

      // Call API to generate meal plan
      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate meal plan');
      }

      const data = await response.json();

      if (!data.success || !data.mealPlan) {
        throw new Error('Invalid response from server');
      }

      // Save meal plan to localStorage
      const mealPlan: MealPlan = data.mealPlan;
      saveMealPlan(mealPlan);

      // Navigate to meal plan display page
      router.push('/meal-plan');
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'An unexpected error occurred');
      setErrorDetails(err.stack || JSON.stringify(err, null, 2));
    }
  };

  // Show error state
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        details={errorDetails || undefined}
        onRetry={() => {
          setError(null);
          setErrorDetails(null);
          generateMealPlan();
        }}
        onGoBack={() => router.push('/settings')}
      />
    );
  }

  // Show loading state
  return <GenerationLoader />;
}
