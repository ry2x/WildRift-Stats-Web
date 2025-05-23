import axios, { AxiosError } from 'axios';
import { WinRates } from '@/types/stats';
import {
  ApiError,
  NetworkError,
  ValidationError,
  withErrorHandling,
} from '@/utils/errorHandling';

const STATS_API_URL =
  'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2';

// Cache for stats data with better type safety
interface StatsCache {
  data: WinRates | null;
  timestamp: number;
  nextUpdateTime: number;
}

let statsCache: StatsCache = {
  data: null,
  timestamp: 0,
  nextUpdateTime: 0,
};

/**
 * Get the next update time (10:00 AM)
 */
function getNextUpdateTime(): number {
  const now = new Date();
  const target = new Date(now);
  target.setHours(10, 0, 0, 0);

  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}

/**
 * Check if the current time is before next update time (10:00 AM)
 */
function isDataFresh(): boolean {
  const now = Date.now();
  return statsCache.data !== null && now < statsCache.nextUpdateTime;
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
  if (!forceRefresh && isDataFresh()) {
    return statsCache.data!;
  }

  return withErrorHandling(
    async () => {
      try {
        const response = await axios.get(STATS_API_URL);

        // Validate data structure
        validateStatsData(response.data);

        // Update cache with next update time
        statsCache = {
          data: response.data,
          timestamp: Date.now(),
          nextUpdateTime: getNextUpdateTime(),
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
            `統計データの取得に失敗しました: ${String(error.message)}`,
            error.response.status
          );
        }

        // Return cached data as fallback if available and the error is not a validation error
        if (statsCache.data && !(error instanceof ValidationError)) {
          console.warn('Using cached stats data as fallback due to error');
          return statsCache.data;
        }

        throw error;
      }
    },
    {
      retry: true,
      maxRetries: 3,
      onError: error => {
        console.error('Error fetching stats data:', error);
      },
    }
  );
}
