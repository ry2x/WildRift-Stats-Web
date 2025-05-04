import { Champion } from '@/types/champion';
import { HeroStats, Lane, RankRange } from '@/types/stats';
import Image from 'next/image';
import { ChampionBasicInfo } from './ChampionBasicInfo';
import { ChampionStats } from './ChampionStats';

interface ChampionDetailsMainProps {
  champion: Champion;
  stats: Record<RankRange, Record<Lane, HeroStats>>;
}

export function ChampionDetailsMain({
  champion,
  stats,
}: ChampionDetailsMainProps) {
  const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;

  return (
    <div className="relative w-full">
      {/* Splash Art Section with gradient overlay */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={splashUrl}
          alt={`${champion.name} splash art`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 -mt-32 min-h-[60vh] bg-slate-900 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <h1 className="text-4xl font-bold text-white">{champion.name}</h1>
          <p className="mt-2 text-xl text-slate-300">{champion.title}</p>

          {/* Basic Info */}
          <ChampionBasicInfo champion={champion} />

          {/* Stats */}
          <ChampionStats stats={stats} />
        </div>
      </div>
    </div>
  );
}
