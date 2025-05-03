/**
 * Format a date string to a localized format
 * @param dateStr - Date string in any valid format
 * @returns Formatted date string in Japanese format
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Format a number to percentage string
 * @param value - Number to format (e.g., 0.4856)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "48.6%")
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};