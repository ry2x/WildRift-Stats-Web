'use client';

import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { useCallback, useState } from 'react';

import { getErrorMessage, isRetryableError } from '@/utils/errorHandling';

interface ErrorMessageProps {
  message?: string;
  error?: unknown;
  onRetry?: () => Promise<void>;
}

export function ErrorMessage({ message, error, onRetry }: ErrorMessageProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const displayMessage = message || getErrorMessage(error);
  const canRetry = onRetry && (error ? isRetryableError(error) : true);

  const handleRetry = useCallback(async () => {
    if (!onRetry) return;

    try {
      setIsRetrying(true);
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry]);

  return (
    <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
      <div className="flex items-start">
        <div className="shrink-0">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-400 dark:text-red-500"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-200">
            {displayMessage}
          </p>
          {canRetry && (
            <button
              type="button"
              onClick={() => void handleRetry()}
              disabled={isRetrying}
              className="mt-2 text-sm font-medium text-red-700 dark:text-red-200 hover:text-red-600 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? 'リトライ中...' : 'もう一度試す'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
