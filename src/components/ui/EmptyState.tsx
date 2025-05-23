import { FC, ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  message?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

/**
 * EmptyState component displays a message when no data is available.
 * Props:
 * - title: Title text to display (optional)
 * - description: Longer description text (optional)
 * - message: Legacy support for single message (optional)
 * - onRetry: Callback for retry button (optional)
 * - children: Custom content to display instead of default message (optional)
 */
export const EmptyState: FC<EmptyStateProps> = ({
  title = '情報が見つかりませんでした',
  description,
  message,
  onRetry,
  children,
}) => {
  return (
    <div className="rounded-lg bg-linear-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/90 p-6 shadow-xl backdrop-blur-sm border border-white/20 dark:border-blue-900/20">
      {children || (
        <div className="text-center">
          <h3 className="text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
            {title}
          </h3>

          {description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {description}
            </p>
          )}

          {message && !description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-md text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              再試行
            </button>
          )}
        </div>
      )}
    </div>
  );
};
