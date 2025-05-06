/**
 * Returns the appropriate text color class based on the win rate
 * @param winRate - The win rate percentage
 * @returns Tailwind CSS color class
 */
export function getWinRateColor(winRate: number): string {
  if (winRate >= 52) return 'text-green-600 dark:text-green-400';
  if (winRate <= 48) return 'text-red-600 dark:text-red-400';
  return 'text-yellow-600 dark:text-yellow-400';
}
