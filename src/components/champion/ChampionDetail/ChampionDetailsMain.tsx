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
  //const splashUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
  const splashUrl = `https:/game.gtimg.cn/images/lgamem/act/lrlib/img/Posters/${champion.id}_0.jpg`;
  const loadingUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`;

  return (
    <div className="relative w-full">
      {/* Splash Art Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {/* Landscape splash art */}
        <div className="hidden landscape:block h-full w-full">
          <Image
            src={splashUrl}
            alt={`${champion.name} splash art`}
            fill
            className="object-top object-cover transform scale-105 transition-transform duration-1000 hover:scale-110"
            priority
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Portrait loading art */}
        <div className="block landscape:hidden h-full w-full">
          <Image
            src={loadingUrl}
            alt={`${champion.name} portrait art`}
            fill
            className="object-top object-cover transform scale-105 transition-transform duration-1000 hover:scale-110"
            priority
            sizes="100vw"
            quality={90}
          />
        </div>

        {/* Multi-layered gradient overlay */}
        <div className="absolute inset-0">
          {/* Base gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/5 dark:via-slate-900/5 to-slate-900/70 dark:to-slate-900/70" />

          {/* Middle transition layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/10 dark:via-slate-900/10 to-slate-100/60 dark:to-slate-900/60" />

          {/* Bottom area layer */}
          <div className="absolute bottom-0 h-1/3 inset-x-0 bg-gradient-to-t from-white/80 dark:from-slate-900/80 to-transparent" />
        </div>

        {/* Text protection layer with backdrop */}
        <div className="absolute bottom-0 h-48 inset-x-0">
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-black/60 via-white/30 dark:via-black/30 to-transparent" />
        </div>

        {/* Champion info section with enhanced layout */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 z-10">
          <div className="max-w-7xl mx-auto">
            {/* Champion title area */}
            <div className="flex flex-col items-center space-y-4">
              {/* Name and title */}
              <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_0_rgb(0_0_0_/_90%)]">
                  {champion.name}
                </h1>
                <p className="text-2xl text-slate-200 italic drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] [text-shadow:_0_2px_0_rgb(0_0_0_/_90%)]">
                  {champion.title}
                </p>
              </div>

              {/* Roles and Lanes with different color schemes */}
              <div className="flex flex-wrap justify-center gap-4">
                {/* Roles - Blue theme */}
                <div className="flex flex-wrap gap-2 items-center">
                  {champion.roles.map(role => (
                    <span
                      key={role}
                      className="inline-block rounded bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-800/90 dark:to-indigo-800/90 px-3 py-1.5 text-sm font-medium text-blue-800 dark:text-blue-100 backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* Lanes - Purple theme */}
                <div className="flex flex-wrap gap-2 items-center">
                  {champion.lanes.map(lane => (
                    <span
                      key={lane}
                      className="inline-block rounded bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-800/90 dark:to-pink-800/90 px-3 py-1.5 text-sm font-medium text-purple-800 dark:text-purple-100 backdrop-blur-sm border border-purple-200/20 dark:border-purple-400/20"
                    >
                      {lane}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with adjusted position */}
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-900">
        {/* Adjusted top gradient */}
        <div className="absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent via-slate-50/95 dark:via-slate-900/95 to-slate-50 dark:to-slate-900" />

        {/* Content wrapper with minimal top padding */}
        <div className="relative max-w-7xl mx-auto px-4 pt-0 pb-6 space-y-12">
          {/* Stats */}
          <ChampionStats stats={stats} />

          {/* Basic Info */}
          <ChampionBasicInfo champion={champion} />
        </div>
      </div>
    </div>
  );
}
