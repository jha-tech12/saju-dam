import type { Pillar } from "@/lib/saju/types";

interface PillarChartProps {
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  name: string;
  date: string;
  time: string | null;
  approximateTimeLabel?: string | null;
}

const labels = [
  { key: "hour", label: "시주" },
  { key: "day", label: "일주" },
  { key: "month", label: "월주" },
  { key: "year", label: "년주" },
] as const;

export function PillarChart({
  pillars,
  name,
  date,
  time,
  approximateTimeLabel,
}: PillarChartProps) {
  const timeLabel = approximateTimeLabel ?? time ?? "출생시간 미상";

  return (
    <div className="card-surface glow-gold rounded-2xl p-6">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-2xl text-gold">{name}님의 사주</h2>
        <p className="mt-2 text-sm text-ivory/60">
          {date} · {timeLabel}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center md:gap-4">
        {labels.map(({ key, label }) => {
          const pillar = key === "hour" ? pillars.hour : pillars[key];
          return (
            <div key={key} className="rounded-xl bg-navy-light/60 p-3 md:p-4">
              <p className="mb-3 text-xs text-gold/70">{label}</p>
              {pillar ? (
                <>
                  <p className="font-serif text-2xl text-ivory md:text-3xl">
                    {pillar.stem}
                  </p>
                  <p className="font-serif text-2xl text-gold md:text-3xl">
                    {pillar.branch}
                  </p>
                </>
              ) : (
                <p className="py-4 text-sm text-ivory/40">미상</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
