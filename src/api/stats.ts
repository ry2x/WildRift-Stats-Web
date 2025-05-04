import axios from 'axios';
import { WinRates } from '../types/stats';

const STATS_API_URL =
  'https://mlol.qt.qq.com/go/lgame_battle_info/hero_rank_list_v2';

/**
 * Fetches champion stats data from the API
 * @returns Promise containing win rate data
 */
export async function fetchStats(): Promise<WinRates> {
  try {
    const response = await axios.get(STATS_API_URL);
    const data = response.data;
    return data as WinRates;
  } catch (error) {
    console.error('Error fetching champion stats:', error);
    throw error;
  }
}
