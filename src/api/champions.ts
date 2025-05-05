import axios from 'axios';
import { Champion, Champions } from '../types/champion';

const CHAMPION_API_URL =
  'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_ja_JP.json';

// Cache for champion data
let championsCache: {
  data: Champions | null;
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
  const lastUpdate = new Date(championsCache.timestamp);

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
 * Validates champion data structure
 * @param data - Data to validate
 * @returns true if data is valid
 */
function isValidChampionData(data: any): data is Champions {
  return (
    Array.isArray(data) &&
    data.every(
      champion =>
        typeof champion === 'object' &&
        champion !== null &&
        typeof champion.id === 'string' &&
        typeof champion.hero_id === 'number' &&
        typeof champion.name === 'string' &&
        Array.isArray(champion.roles) &&
        Array.isArray(champion.lanes)
    )
  );
}

/**
 * Fetches champion data from the API and filters for Wild Rift champions only
 * Data is updated daily at 10:00 AM
 * @param forceRefresh - Whether to force a cache refresh
 * @returns Promise containing Wild Rift champion data
 */
export async function fetchChampions(forceRefresh = false): Promise<Champions> {
  try {
    // Return cached data if it's fresh and not forcing refresh
    if (!forceRefresh && championsCache.data && isDataFresh()) {
      return championsCache.data;
    }

    // Fetch new data
    const response = await axios.get(CHAMPION_API_URL, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    // Validate data structure
    if (!isValidChampionData(response.data)) {
      throw new Error('Invalid champion data structure');
    }

    // Filter and process data
    const wildRiftChampions = response.data.filter(champion => champion.is_wr);

    // Update cache
    championsCache = {
      data: wildRiftChampions,
      timestamp: Date.now(),
    };

    return wildRiftChampions;
  } catch (error) {
    // If we have cached data and encounter an error, return cached data
    if (championsCache.data) {
      console.warn('Error fetching champion data, using cached data:', error);
      return championsCache.data;
    }
    console.error('Error fetching champion data:', error);
    throw error;
  }
}
