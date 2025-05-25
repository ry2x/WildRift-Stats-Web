import { SortKey } from '@/types/sort';

export const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'win_rate', label: '勝率' },
  { key: 'appear_rate', label: 'ピック率' },
  { key: 'forbid_rate', label: 'バン率' },
];
