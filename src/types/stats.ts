/**
 * Hero statistics from CN winRate API
 */
export type HeroStats = {
  /** Unique identifier */
  id: number;
  /** Position/lane of the hero */
  position: string;
  /** Hero ID for API calls */
  hero_id: number;
  /** Strength rating */
  strength: string;
  /** Weight rating */
  weight: string;
  /** Appearance rate */
  appear_rate: string;
  /** Appearance rate benchmark */
  appear_bzc: string;
  /** Ban rate */
  forbid_rate: string;
  /** Ban rate benchmark */
  forbid_bzc: string;
  /** Win rate */
  win_rate: string;
  /** Win rate benchmark */
  win_bzc: string;
  /** Date of the statistics */
  dtstatdate: string;
  /** Strength level */
  strength_level: string;
  /** Appearance rate as float */
  appear_rate_float: string;
  /** Ban rate as float */
  forbid_rate_float: string;
  /** Win rate as float */
  win_rate_float: string;
  /** Appearance rate as percentage */
  appear_rate_percent: string;
  /** Ban rate as percentage */
  forbid_rate_percent: string;
  /** Win rate as percentage */
  win_rate_percent: string;
};

/**
 * Rank ranges for statistics (API format)
 * 0:ALL 1:Dia+ 2:Mas+ 3:Ch+ 4:super server
 */
export type RankRange = '0' | '1' | '2' | '3' | '4';

/**
 * Lane positions in the game (API format)
 * 0:all 1:mid 2:top 3:adc 4:sup 5:jg
 */
export type Lane = '1' | '2' | '3' | '4' | '5' | '0';

/**
 * Statistics for each lane position
 */
export type PositionStats = Partial<Record<Lane, HeroStats[]>>;

/**
 * Statistics for each rank range
 */
export type RankStats = {
  [K in RankRange]: PositionStats;
};

/**
 * Complete win rate data from CN winRate API
 */
export type WinRates = {
  /** Result code */
  result: number;
  /** Statistics data */
  data: RankStats;
};
