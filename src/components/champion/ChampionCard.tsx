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
    <Link href={`/champions/${champion.id}`} className="champion-card group">
      {/* Champion Image with Loading State */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/50 dark:to-purple-900/50">
        <Image
          src={`https://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/${champion.id}.png`}
          alt={champion.name}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(min-width: 1024px) 200px, (min-width: 768px) 150px, 120px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRseHyAiJRwlKigsMCktLzAxNjY2MjU3NkNEREVFSElIUlJUX19tbW1ubm5ubm7/2wBDARUXFx4aHh4pIR8pOTEvOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTn/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
      </div>

      {/* Champion Info with Enhanced Styling */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          {champion.name}
        </h3>
        <div className="flex flex-wrap gap-1">
          {champion.roles.map(role => (
            <span
              key={role}
              className="inline-block rounded bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-800/90 dark:to-purple-800/90 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-100 backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
