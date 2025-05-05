import axios, { AxiosError } from 'axios';
import { WinRates } from '../types/stats';
import {
  ApiError,
  NetworkError,
  ValidationError,
  withErrorHandling,
} from '../utils/errorHandling';

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
 * @throws {ValidationError} If data structure is invalid
 */
function validateStatsData(data: unknown): asserts data is WinRates {
  if (
    typeof data !== 'object' ||
    data === null ||
    typeof (data as WinRates).result !== 'number' ||
    typeof (data as WinRates).data !== 'object' ||
    (data as WinRates).data === null
  ) {
    throw new ValidationError('不正な統計データ形式です');
  }

  // Validate rank data structure
  const statsData = (data as WinRates).data;
  for (const rankData of Object.values(statsData)) {
    if (typeof rankData !== 'object' || rankData === null) {
      throw new ValidationError('不正なランクデータ形式です');
    }

    // Validate lane data structure
    for (const laneData of Object.values(rankData)) {
      if (!Array.isArray(laneData)) {
        throw new ValidationError('不正なレーンデータ形式です');
      }

      // Validate hero stats
      for (const heroStat of laneData) {
        if (
          typeof heroStat !== 'object' ||
          heroStat === null ||
          typeof heroStat.hero_id !== 'string' || // number -> string
          typeof heroStat.win_rate_percent !== 'string' ||
          typeof heroStat.appear_rate_percent !== 'string' ||
          typeof heroStat.forbid_rate_percent !== 'string'
        ) {
          throw new ValidationError('不正なヒーロー統計データ形式です');
        }
      }
    }
  }
}

/**
 * Fetches champion stats data from the API
 * Data is updated daily at 10:00 AM
 * @throws {ApiError} If API returns an error
 * @throws {NetworkError} If network error occurs
 * @throws {ValidationError} If data validation fails
 */
export async function fetchStats(forceRefresh = false): Promise<WinRates> {
  // Return cached data if it's fresh and not forcing refresh
  if (!forceRefresh && statsCache.data && isDataFresh()) {
    return statsCache.data;
  }

  return withErrorHandling(
    async () => {
      try {
        const response = await axios.get(STATS_API_URL);

        // Validate data structure
        validateStatsData(response.data);

        // Update cache
        statsCache = {
          data: response.data,
          timestamp: Date.now(),
        };

        return response.data;
      } catch (error) {
        // Handle axios errors
        if (error instanceof AxiosError) {
          if (!error.response) {
            throw new NetworkError(
              '統計データの取得中にネットワークエラーが発生しました'
            );
          }
          throw new ApiError(
            `統計データの取得に失敗しました: ${error.message}`,
            error.response.status
          );
        }

        // Re-throw validation errors
        if (error instanceof ValidationError) {
          throw error;
        }

        // Handle other errors
        throw new Error(`予期せぬエラーが発生しました: ${error}`);
      }
    },
    {
      retry: true,
      maxRetries: 3,
      onError: error => {
        console.error('Error fetching stats data:', error);

        // Return cached data as fallback if available
        if (statsCache.data) {
          console.warn('Using cached stats data as fallback');
          return statsCache.data;
        }
      },
    }
  );
}
