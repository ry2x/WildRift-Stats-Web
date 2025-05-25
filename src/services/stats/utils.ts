/**
 * Stats data utilities for data transformation and validation
 */

import type { WinRates, HeroStats, RankRange, Lane } from './types';
import { ValidationError } from '../api/error';

/**
 * Validates stats data structure using type guard
 */
export function validateStatsData(data: unknown): data is WinRates {
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof (data as WinRates).result !== 'number' ||
    typeof (data as WinRates).data !== 'object' ||
    (data as WinRates).data === null
  ) {
    return false;
  }

  // Validate rank data structure
  const statsData = (data as WinRates).data;
  for (const rankData of Object.values(statsData)) {
    if (typeof rankData !== 'object' || rankData === null) {
      return false;
    }

    // Validate lane data structure
    for (const laneData of Object.values(rankData)) {
      if (!Array.isArray(laneData)) {
        return false;
      }

      // Validate hero stats
      for (const heroStat of laneData) {
        if (
          typeof heroStat !== 'object' ||
          heroStat === null ||
          typeof heroStat.hero_id !== 'string' ||
          typeof heroStat.win_rate_percent !== 'string' ||
          typeof heroStat.appear_rate_percent !== 'string' ||
          typeof heroStat.forbid_rate_percent !== 'string'
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

/**
 * Transform raw API data to application format
 */
export function transformStatsData(rawData: unknown): WinRates {
  if (!validateStatsData(rawData)) {
    throw new ValidationError('Invalid stats data structure');
  }
  return rawData;
}

/**
 * Calculate average win rate for a specific lane
 */
export function calculateAverageWinRate(stats: WinRates, lane: Lane): number {
  const allStats: HeroStats[] = [];

  // Collect all hero stats for the specified lane across all ranks
  Object.values(stats.data).forEach(rankData => {
    if (rankData[lane]) {
      allStats.push(...rankData[lane]);
    }
  });

  if (allStats.length === 0) return 0;

  const totalWinRate = allStats.reduce((sum, heroStat) => {
    return sum + parseFloat(heroStat.win_rate_percent);
  }, 0);

  return totalWinRate / allStats.length;
}

/**
 * Get champion tier list for a specific rank
 */
export function getChampionTierList(
  stats: WinRates,
  rank: RankRange
): HeroStats[] {
  const rankData = stats.data[rank];
  if (!rankData) return [];

  // Combine all lanes and sort by win rate
  const allHeroStats: HeroStats[] = [];
  Object.values(rankData).forEach(laneStats => {
    allHeroStats.push(...laneStats);
  });

  // Sort by win rate descending
  return allHeroStats.sort((a, b) => {
    const aWinRate = parseFloat(a.win_rate_percent);
    const bWinRate = parseFloat(b.win_rate_percent);
    return bWinRate - aWinRate;
  });
}

/**
 * Get stats for a specific champion by rank and lane
 */
export function getChampionStatsByRankAndLane(
  stats: WinRates,
  rank: RankRange,
  lane: Lane
): HeroStats[] {
  const rankData = stats.data[rank];
  if (!rankData || !rankData[lane]) return [];

  return rankData[lane];
}

/**
 * Get specific champion stats by hero_id
 */
export function getChampionStatsByHeroId(
  stats: WinRates,
  heroId: string,
  rank?: RankRange,
  lane?: Lane
): HeroStats | undefined {
  if (rank && lane) {
    // Search in specific rank and lane
    const laneStats = getChampionStatsByRankAndLane(stats, rank, lane);
    return laneStats.find(stat => stat.hero_id === heroId);
  }

  if (rank) {
    // Search in all lanes of the specific rank
    const rankData = stats.data[rank];
    if (!rankData) return undefined;

    for (const laneStats of Object.values(rankData)) {
      const found = laneStats.find(stat => stat.hero_id === heroId);
      if (found) return found;
    }
    return undefined;
  }

  // Search in all ranks and lanes
  for (const rankData of Object.values(stats.data)) {
    for (const laneStats of Object.values(rankData)) {
      const found = laneStats.find(stat => stat.hero_id === heroId);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Get color code based on win rate
 */
export function getWinRateColor(winRate: number): string {
  if (winRate >= 55) return '#22c55e'; // Green
  if (winRate >= 52) return '#eab308'; // Yellow
  if (winRate >= 48) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

/**
 * Get color code based on strength value
 */
export function getStrengthColor(strength: number): string {
  if (strength >= 8) return '#22c55e'; // Green
  if (strength >= 6) return '#eab308'; // Yellow
  if (strength >= 4) return '#f97316'; // Orange
  return '#ef4444'; // Red
}

/**
 * Calculate champion strength score based on win rate and appearance rate
 */
export function calculateChampionStrength(heroStat: HeroStats): number {
  const winRate = parseFloat(heroStat.win_rate_percent);
  const appearanceRate = parseFloat(heroStat.appear_rate_percent);

  // Simple strength calculation: weighted average with win rate having more weight
  return (winRate * 0.7 + appearanceRate * 0.3) / 10;
}
