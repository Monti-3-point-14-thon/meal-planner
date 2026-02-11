// Error display component for meal plan generation failures

interface ErrorDisplayProps {
  error: string;
  details?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export default function ErrorDisplay({
  error,
  details,
  onRetry,
  onGoBack,
}: ErrorDisplayProps) {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          {/* Error icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-error/20 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Error message */}
          <h2 className="text-3xl font-bold mb-4">Something Went Wrong</h2>
          <p className="text-lg mb-6">{error}</p>

          {/* Technical details (collapsible) */}
          {details && (
            <div className="mb-6">
              <details className="collapse collapse-arrow bg-base-200 rounded-lg">
                <summary className="collapse-title text-sm font-medium">
                  Technical Details
                </summary>
                <div className="collapse-content text-xs text-left">
                  <pre className="whitespace-pre-wrap break-words p-4 bg-base-300 rounded">
                    {details}
                  </pre>
                </div>
              </details>
            </div>
          )}

          {/* Common error explanations */}
          <div className="alert alert-info text-left mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="text-sm">
              <p className="font-semibold mb-2">Common causes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>AI service is temporarily unavailable</li>
                <li>Network connection issues</li>
                <li>Rate limit reached (try again in a minute)</li>
                <li>Invalid API configuration</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {onRetry && (
              <button onClick={onRetry} className="btn btn-primary btn-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
            )}
            {onGoBack && (
              <button onClick={onGoBack} className="btn btn-outline btn-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Settings
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
