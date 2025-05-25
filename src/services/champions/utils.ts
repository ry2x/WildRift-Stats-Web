/**
 * Champion data utilities for data transformation and validation
 */

import type { Champion, Champions, LaneKey, RoleKey } from './types';
import { ValidationError } from '../api/error';

/**
 * Validates champion data structure
 * @throws {ValidationError} If data structure is invalid
 */
export function validateChampionData(data: unknown): data is Champions {
  if (!Array.isArray(data)) {
    return false;
  }
  return data.every(champion => {
    const championData = champion as Record<string, unknown>;
    return (
      typeof championData === 'object' &&
      championData !== null &&
      typeof championData.id === 'string' &&
      typeof championData.hero_id === 'number' &&
      typeof championData.name === 'string' &&
      Array.isArray(championData.roles) &&
      Array.isArray(championData.lanes)
    );
  });
}

/**
 * Transform raw API data to application format
 */
export function transformChampionData(rawData: unknown): Champions {
  if (!validateChampionData(rawData)) {
    throw new ValidationError('Invalid champion data structure');
  }

  // Filter for Wild Rift champions only
  const wildRiftChampions = rawData.filter(
    (champion: Champion): champion is Champion => Boolean(champion.is_wr)
  );

  return wildRiftChampions;
}

/**
 * Create a champion map for efficient lookups by hero_id
 */
export function createChampionMap(champions: Champions): Map<number, Champion> {
  return new Map(champions.map(champion => [champion.hero_id, champion]));
}

/**
 * Filter champions by role
 */
export function filterChampionsByRole(
  champions: Champions,
  role: RoleKey
): Champions {
  return champions.filter(champion => champion.roles.includes(role));
}

/**
 * Filter champions by lane
 */
export function filterChampionsByLane(
  champions: Champions,
  lane: LaneKey
): Champions {
  return champions.filter(champion => champion.lanes.includes(lane));
}

/**
 * Sort champions by specified key and order
 */
export function sortChampions(
  champions: Champions,
  sortKey: string = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Champions {
  return [...champions].sort((a, b) => {
    let aValue: unknown = a[sortKey as keyof Champion];
    let bValue: unknown = b[sortKey as keyof Champion];

    // Handle array properties (join for comparison)
    if (Array.isArray(aValue)) aValue = aValue.join(', ');
    if (Array.isArray(bValue)) bValue = bValue.join(', ');

    // Convert to string for comparison
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();

    if (sortOrder === 'asc') {
      return aString < bString ? -1 : aString > bString ? 1 : 0;
    } else {
      return aString > bString ? -1 : aString < bString ? 1 : 0;
    }
  });
}

/**
 * Search champions by name (supports hiragana conversion)
 */
export function searchChampions(
  champions: Champions,
  searchTerm: string
): Champions {
  if (!searchTerm) return champions;

  const normalizedTerm = searchTerm.toLowerCase();

  return champions.filter(
    champion =>
      champion.name.toLowerCase().includes(normalizedTerm) ||
      champion.id.toLowerCase().includes(normalizedTerm)
  );
}
