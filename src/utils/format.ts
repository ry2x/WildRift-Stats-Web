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
    day: 'numeric',
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

/**
 * Converts a date string from YYYYMMDD format to YYYY-MM-DD format
 * @param dateStr - Date string in YYYYMMDD format (e.g., "20250520")
 * @returns Formatted date string in YYYY-MM-DD format (e.g., "2025-05-20")
 */
export const formatYYYYMMDDtoISO = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) {
    throw new Error('Invalid date format. Expected YYYYMMDD format.');
  }

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  return `${year}-${month}-${day}`;
};
