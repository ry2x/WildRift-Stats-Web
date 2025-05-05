/**
 * Custom error types for the application
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public isRetryable: boolean = true
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string = 'ネットワークエラーが発生しました',
    public isRetryable: boolean = true
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Get user-friendly error message based on error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return `APIエラー: ${error.message}`;
  }
  if (error instanceof NetworkError) {
    return `通信エラー: ${error.message}`;
  }
  if (error instanceof ValidationError) {
    return `入力エラー: ${error.message}`;
  }
  if (error instanceof Error) {
    return `エラーが発生しました: ${error.message}`;
  }
  return '予期せぬエラーが発生しました';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError || error instanceof NetworkError) {
    return error.isRetryable;
  }
  return false;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error;
      }

      if (i === maxRetries - 1) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Wrap async function with error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: {
    retry?: boolean;
    maxRetries?: number;
    onError?: (error: unknown) => void;
  } = {}
): Promise<T> {
  const { retry = true, maxRetries = 3, onError } = options;

  try {
    if (retry) {
      return await retryWithBackoff(fn, maxRetries);
    } else {
      return await fn();
    }
  } catch (error) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
}
