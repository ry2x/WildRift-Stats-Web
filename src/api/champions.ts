import axios from 'axios';
import { Champion, Champions } from '../types/champion';

const CHAMPION_API_URL =
  'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_ja_JP.json';

/**
 * Fetches champion data from the API and filters for Wild Rift champions only
 * @returns Promise containing Wild Rift champion data
 */
export async function fetchChampions(): Promise<Champions> {
  try {
    const response = await axios.get(CHAMPION_API_URL);
    const data: Champions = response.data;
    // Filter for Wild Rift champions only
    const wildRiftChampions = data.filter(champion => champion.is_wr);
    console.log('fetchChampions:', wildRiftChampions); // Debugging line
    return wildRiftChampions;
  } catch (error) {
    console.error('Error fetching champion data:', error);
    throw error;
  }
}
