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
    const requestTimestamp = new Date().toISOString();
    console.log('🔵 [Client] Starting meal generation', {
      timestamp: requestTimestamp,
      endpoint: '/api/generate-meal-plan',
    });

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

      console.log('🔵 [Client] Response received', {
        timestamp: new Date().toISOString(),
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: {
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorDetails = data.error || data.details || 'Generation failed';
        console.error('❌ [Client] Generation failed', {
          timestamp: new Date().toISOString(),
          status: response.status,
          error: errorDetails,
          details: data.details,
          requestId: data.requestId,
        });
        throw new Error(errorDetails);
      }

      console.log('✅ [Client] Meal plan generated', {
        timestamp: new Date().toISOString(),
        mealsCount: data.mealPlan.meals.length,
        totalCalories: data.mealPlan.daily_totals.calories,
      });

      // Save meal plan to localStorage
      const mealPlan: MealPlan = data.mealPlan;
      saveMealPlan(mealPlan);

      // Navigate to meal plan display page
      router.push('/meal-plan');
    } catch (err: any) {
      console.error('❌ [Client] Fetch error', {
        timestamp: new Date().toISOString(),
        errorMessage: err.message,
        errorType: err.constructor.name,
        isNetworkError: err instanceof TypeError,
      });
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
