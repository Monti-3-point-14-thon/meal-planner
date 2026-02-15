// Generation page - triggers meal plan generation and shows loading state

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GenerationLoader from '@/app/components/GenerationLoader';
import ErrorDisplay from '@/app/components/ErrorDisplay';

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    generateMealPlan();
  }, []);

  const generateMealPlan = async () => {
    const requestTimestamp = new Date().toISOString();
    console.log('🔵 [Client] Starting meal generation', {
      timestamp: requestTimestamp,
      endpoint: '/api/meal-plans',
    });

    try {
      // Get primaryGoal from query params or use default
      const primaryGoal = searchParams.get('goal') || 'general_health';
      const customPrompt = searchParams.get('prompt') || undefined;

      // Call API to generate meal plan
      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ primaryGoal, customPrompt }),
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
        const errorDetails = data.error || 'Generation failed';
        console.error('❌ [Client] Generation failed', {
          timestamp: new Date().toISOString(),
          status: response.status,
          error: errorDetails,
        });
        throw new Error(errorDetails);
      }

      console.log('✅ [Client] Meal plan generated', {
        timestamp: new Date().toISOString(),
        weekPlanId: data.weekPlanId,
      });

      // Navigate to meal plan display page with the new plan ID
      router.push(`/meal-plan/${data.weekPlanId}`);
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
