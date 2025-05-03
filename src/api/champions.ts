import { Champions } from '../types/champion';

const CHAMPION_API_URL =
  'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_ja_JP.json';

/**
 * Fetches champion data from the API
 * @returns Promise containing champion data
 */
export async function fetchChampions(): Promise<Champions> {
  try {
    const response = await fetch(CHAMPION_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch champions: ${response.statusText}`);
    }
    const data = await response.json();
    return data as Champions;
  } catch (error) {
    console.error('Error fetching champion data:', error);
    throw error;
  }
}
