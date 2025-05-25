import { SortKey } from '@/contexts/SortContext';
import { LaneKey, RoleKey } from '@/types/champion';
import { Lane, RankRange } from '@/types/stats';

export const roleLabels: Record<RoleKey, string> = {
  fighter: 'ファイター',
  mage: 'メイジ',
  assassin: 'アサシン',
  marksman: 'マークスマン',
  support: 'サポート',
  tank: 'タンク',
};

export const laneLabels: Record<LaneKey, string> = {
  mid: 'ミッド',
  jungle: 'ジャングル',
  top: 'トップ',
  support: 'サポート',
  ad: 'ボット',
};

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'name', label: '名前' },
  { value: 'difficult', label: '難易度' },
  { value: 'damage', label: 'ダメージ' },
  { value: 'survive', label: '生存性' },
  { value: 'utility', label: 'ユーティリティ' },
];

// Map API rank values to display names
export const rankDisplayNames: Record<RankRange, string> = {
  '0': '全ランク',
  '1': 'ダイヤモンド+',
  '2': 'マスター+',
  '3': 'チャレンジャー+',
  '4': 'スーパーサーバー',
};

// Map API lane values to display names
export const laneDisplayNames: Record<Lane, string> = {
  '1': 'ミッド',
  '2': 'トップ',
  '3': 'ボット',
  '4': 'サポート',
  '5': 'ジャングル',
};
