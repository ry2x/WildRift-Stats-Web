'use client';

interface ErrorMessageProps {
  /** Error message to display */
  message: string;
  /** Optional retry handler */
  onRetry?: () => void;
  /** Optional error object */
  error?: Error | null;
}

export function ErrorMessage({ message, onRetry, error }: ErrorMessageProps) {
  return (
    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          {/* Error icon */}
          <svg
            className="h-5 w-5 text-red-400 dark:text-red-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-200">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium"
            >
              再試行
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
