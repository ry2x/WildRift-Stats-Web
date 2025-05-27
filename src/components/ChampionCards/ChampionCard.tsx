import Link from 'next/link';

import { GeneralImage } from '@/components/ui/GeneralImage';
import { roleLabels } from '@/constants/game';
import { Champion } from '@/types/champion';
import { HeroStats } from '@/types/stats';

interface ChampionCardProps {
  champion: Champion;
  stats?: HeroStats;
}

export const ChampionCard = ({ champion }: ChampionCardProps) => {
  return (
    <Link
      href={`/champions/${champion.id}`}
      className="base-card hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden shadow-md group"
    >
      {/* Champion Image with Loading State */}
      <div className="relative aspect-square w-full overflow-hidden bg-linear-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/50 dark:to-purple-900/50">
        <GeneralImage
          src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champion.id}.png`}
          alt={champion.name}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(min-width: 1024px) 200px, (min-width: 768px) 150px, 120px"
          fallbackSrc=""
        />
      </div>

      {/* Champion Info with Enhanced Styling */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {champion.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          {champion.roles.map(role => (
            <span
              key={role}
              className="role-badge px-2 py-1 text-xs font-medium"
            >
              {roleLabels[role]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
