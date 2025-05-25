/**
 * Common error types and handling utilities for API operations
 */
import {
  ApiError,
  NetworkError,
  ValidationError,
  CacheError,
} from '@/types/api';

// Re-export for backward compatibility
export { ApiError, NetworkError, ValidationError, CacheError };

/**
 * Handle API errors and convert them to appropriate error types
 */
export function handleApiError(error: unknown): Error {
  if (error instanceof ApiError) return error;
  if (error instanceof NetworkError) return error;
  if (error instanceof ValidationError) return error;
  if (error instanceof CacheError) return error;
  // Handle fetch API errors
  if (
    error instanceof TypeError &&
    (error.message.includes('fetch') ||
      error.message.includes('Failed to parse URL'))
  ) {
    return new NetworkError(
      'ネットワークエラーが発生しました: ' + error.message
    );
  }

  // Handle unknown errors
  if (error instanceof Error) {
    return new Error(`予期せぬエラーが発生しました: ${error.message}`);
  }

  return new Error(`予期せぬエラーが発生しました: ${String(error)}`);
}

/**
 * Async error handler wrapper for consistent error processing
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw handleApiError(error);
  }
}

/**
 * Type guard to check if an error is an instance of ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard to check if an error is an instance of NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

/**
 * Type guard to check if an error is an instance of ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}
