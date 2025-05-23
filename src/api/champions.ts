import axios, { AxiosError } from 'axios';
import { Champion, Champions } from '@/types/champion';
import {
  ApiError,
  NetworkError,
  ValidationError,
  withErrorHandling,
} from '@/utils/errorHandling';

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
 * @throws {ValidationError} If data structure is invalid
 */
function validateChampionData(data: Champions): asserts data is Champions {
  if (!Array.isArray(data)) {
    throw new ValidationError('チャンピオンデータが配列ではありません');
  }

  for (const champion of data) {
    if (
      typeof champion !== 'object' ||
      champion === null ||
      typeof champion.id !== 'string' ||
      typeof champion.hero_id !== 'number' ||
      typeof champion.name !== 'string' ||
      !Array.isArray(champion.roles) ||
      !Array.isArray(champion.lanes)
    ) {
      throw new ValidationError(
        `不正なチャンピオンデータ: ${JSON.stringify(champion)}`
      );
    }
  }
}

/**
 * Fetches champion data from the API and filters for Wild Rift champions only
 * Data is updated daily at 10:00 AM
 * @throws {ApiError} If API returns an error
 * @throws {NetworkError} If network error occurs
 * @throws {ValidationError} If data validation fails
 */
export async function fetchChampions(forceRefresh = false): Promise<Champions> {
  // Return cached data if it's fresh and not forcing refresh
  if (!forceRefresh && championsCache.data && isDataFresh()) {
    return championsCache.data;
  }

  return withErrorHandling(
    async () => {
      try {
        const response = await axios.get<Champions>(CHAMPION_API_URL, {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });

        // Validate data structure
        validateChampionData(response.data);

        // Filter and process data
        const wildRiftChampions = response.data.filter(
          (champion): champion is Champion => Boolean(champion.is_wr)
        );

        // Update cache
        championsCache = {
          data: wildRiftChampions,
          timestamp: Date.now(),
        };

        return wildRiftChampions;
      } catch (error) {
        // Handle axios errors
        if (error instanceof AxiosError) {
          if (!error.response) {
            throw new NetworkError(
              'チャンピオンデータの取得中にネットワークエラーが発生しました'
            );
          }
          throw new ApiError(
            `チャンピオンデータの取得に失敗しました: ${error.message}`,
            error.response.status
          );
        }

        // Re-throw validation errors
        if (error instanceof ValidationError) {
          throw error;
        }

        // Handle other errors
        throw new Error(`予期せぬエラーが発生しました: ${String(error)}`);
      }
    },
    {
      retry: true,
      maxRetries: 3,
      onError: (error): Champions | undefined => {
        console.error('Error fetching champion data:', error);

        // Return cached data as fallback if available
        if (championsCache.data) {
          console.warn('Using cached champion data as fallback');
          return championsCache.data;
        }
        return undefined;
      },
    }
  );
}
