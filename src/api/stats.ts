import axios from 'axios';
import { WinRates } from '../types/stats';

const STATS_API_URL =
  'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2';

// Cache for stats data
let statsCache: {
  data: WinRates | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

/**
 * Check if the current time is after today's update time (10:00 AM)
 * and before tomorrow's update time
 */
function isDataFresh(): boolean {
  const now = new Date();
  const lastUpdate = new Date(statsCache.timestamp);

  // Get today's update time (10:00 AM)
  const todayUpdate = new Date();
  todayUpdate.setHours(10, 0, 0, 0);

  // If current time is before today's update, data is fresh if it's from yesterday after update
  if (now < todayUpdate) {
    const yesterdayUpdate = new Date(todayUpdate);
    yesterdayUpdate.setDate(yesterdayUpdate.getDate() - 1);
    return lastUpdate >= yesterdayUpdate;
  }

  // If current time is after today's update, data should be from after today's update
  return lastUpdate >= todayUpdate;
}

/**
 * Validate stats data structure
 */
function isValidStatsData(data: any): data is WinRates {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.result === 'number' &&
    typeof data.data === 'object' &&
    data.data !== null &&
    Object.values(data.data).every(
      rankData =>
        typeof rankData === 'object' &&
        rankData !== null &&
        Object.values(rankData).every(Array.isArray)
    )
  );
}

/**
 * Fetches champion stats data from the API
 * Data is updated daily at 10:00 AM
 * @param forceRefresh - Whether to force a cache refresh
 * @returns Promise containing win rate data
 */
export async function fetchStats(forceRefresh = false): Promise<WinRates> {
  try {
    // Return cached data if it's fresh and not forcing refresh
    if (!forceRefresh && statsCache.data && isDataFresh()) {
      return statsCache.data;
    }

    // Fetch new data
    const response = await axios.get(STATS_API_URL);

    // Validate data structure
    if (!isValidStatsData(response.data)) {
      throw new Error('Invalid stats data structure');
    }

    // Update cache
    statsCache = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    // If we have cached data and encounter an error, return cached data
    if (statsCache.data) {
      console.warn('Error fetching stats data, using cached data:', error);
      return statsCache.data;
    }
    console.error('Error fetching stats data:', error);
    throw error;
  }
}
