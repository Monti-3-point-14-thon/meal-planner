// Loading component for meal plan generation

interface GenerationLoaderProps {
  message?: string;
}

export default function GenerationLoader({
  message = 'Generating your personalized meal plan...',
}: GenerationLoaderProps) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          {/* Loading spinner */}
          <div className="flex justify-center mb-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>

          {/* Main message */}
          <h2 className="text-3xl font-bold mb-4">{message}</h2>

          {/* Submessages with staggered animation */}
          <div className="space-y-3 text-sm opacity-70">
            <p className="animate-pulse" style={{ animationDelay: '0s' }}>
              🧬 Analyzing your nutritional needs...
            </p>
            <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              🍽️ Crafting personalized meals...
            </p>
            <p className="animate-pulse" style={{ animationDelay: '1s' }}>
              📊 Calculating macronutrients...
            </p>
            <p className="animate-pulse" style={{ animationDelay: '1.5s' }}>
              🔬 Validating scientific accuracy...
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <progress className="progress progress-primary w-full"></progress>
          </div>

          {/* Helper text */}
          <div className="mt-8 text-xs opacity-60">
            <p>This may take 10-30 seconds depending on AI model response time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
