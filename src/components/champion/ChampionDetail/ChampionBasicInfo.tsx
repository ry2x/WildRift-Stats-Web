import { Champion } from '@/types/champion';

interface ChampionBasicInfoProps {
  champion: Champion;
}

export function ChampionBasicInfo({ champion }: ChampionBasicInfoProps) {
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      {/* Description */}
      <div className="text-slate-200">
        <h2 className="text-xl font-semibold text-white">Description</h2>
        <p className="mt-2 leading-relaxed">{champion.describe}</p>
      </div>

      {/* Stats and Info */}
      <div className="space-y-4">
        {/* Champion Stats */}
        <div className="space-y-3 p-4 rounded-lg bg-slate-800/50">
          {/* Difficulty */}
          <div>
            <h3 className="text-sm font-medium text-slate-300">難易度</h3>
            <div className="mt-1 flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded ${
                    i < Math.ceil(champion.difficult)
                      ? 'bg-purple-500'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Damage */}
          <div>
            <h3 className="text-sm font-medium text-slate-300">ダメージ</h3>
            <div className="mt-1 flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded ${
                    i < Math.ceil(champion.damage)
                      ? 'bg-red-500'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Survivability */}
          <div>
            <h3 className="text-sm font-medium text-slate-300">生存性</h3>
            <div className="mt-1 flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded ${
                    i < Math.ceil(champion.survive)
                      ? 'bg-green-500'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Utility */}
          <div>
            <h3 className="text-sm font-medium text-slate-300">
              ユーティリティ
            </h3>
            <div className="mt-1 flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded ${
                    i < Math.ceil(champion.utility)
                      ? 'bg-blue-500'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Roles */}
        <div>
          <h3 className="text-lg font-medium text-white">Roles</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {champion.roles.map(role => (
              <span
                key={role}
                className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Lanes */}
        <div>
          <h3 className="text-lg font-medium text-white">Lanes</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {champion.lanes.map(lane => (
              <span
                key={lane}
                className="rounded bg-slate-700 px-3 py-1 text-sm text-white"
              >
                {lane}
              </span>
            ))}
          </div>
        </div>

        {/* Free Champion Status */}
        {champion.is_free && (
          <div className="rounded bg-blue-500/20 p-2 text-blue-300">
            ⭐ Free Champion This Week
          </div>
        )}
      </div>
    </div>
  );
}
