import Image from 'next/image';
import Link from 'next/link';
import { Champion, HeroStats } from '@/types';
import { formatPercentage } from '@/utils/format';

interface ChampionCardProps {
  champion: Champion;
  stats?: HeroStats;
}

export const ChampionCard = ({ champion, stats }: ChampionCardProps) => {
  return (
    <Link
      href={`/champion/${champion.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105 "
    >
      {/* Champion Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champion.id}.png`}
          alt={champion.name}
          fill
          className="object-cover transition-transform group-hover:scale-110"
          sizes="(min-width: 1024px) 200px, (min-width: 768px) 150px, 120px"
        />
      </div>

      {/* Champion Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 ">
          {champion.name}
        </h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {champion.roles.map(role => (
            <span
              key={role}
              className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 "
            >
              {role}
            </span>
          ))}
        </div>

        {/* Stats */}
        {stats && (
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <p className="font-medium text-green-600 ">
                {formatPercentage(parseFloat(stats.win_rate_percent))}
              </p>
              <p className="text-xs text-gray-500 ">勝率</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-blue-600 ">
                {formatPercentage(parseFloat(stats.appear_rate_percent))}
              </p>
              <p className="text-xs text-gray-500 ">Pick率</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-red-600 ">
                {formatPercentage(parseFloat(stats.forbid_rate_percent))}
              </p>
              <p className="text-xs text-gray-500 ">Ban率</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
