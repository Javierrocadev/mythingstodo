"use client";

interface DayEarnings {
  day: string;
  label: string;
  earned: number;
}

interface WeeklyEarningsBarsProps {
  days: DayEarnings[];
}

export function WeeklyEarningsBars({ days }: WeeklyEarningsBarsProps) {
  const todayStr = new Date().toISOString().slice(0, 10);
  const maxEarned = Math.max(...days.map((d) => d.earned), 1);
  const totalEarned = days.reduce((s, d) => s + d.earned, 0);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-col gap-2.5">
        {days.map((d) => {
          const isToday = d.day === todayStr;
          const earnedPct = maxEarned > 0 ? Math.round((d.earned / maxEarned) * 100) : 0;

          return (
            <div
              key={d.day}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                isToday ? "bg-primary/5 ring-1 ring-primary/20" : ""
              }`}
            >
              <div className="flex w-9 shrink-0 flex-col items-center">
                <span className={`text-xs font-semibold ${isToday ? "text-primary" : "text-foreground"}`}>
                  {d.label}
                </span>
                {isToday && (
                  <span className="mt-0.5 flex items-center gap-1 text-[10px] text-primary/60">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    ahora
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <div className={`h-2 flex-1 overflow-hidden rounded-full ${isToday ? "bg-primary/10" : "bg-muted"}`}>
                    <div
                      className={`h-full rounded-full transition-all ${isToday ? "bg-primary/60" : "bg-emerald-400"}`}
                      style={{ width: `${earnedPct}%` }}
                    />
                  </div>
                  <span className={`w-16 text-right text-xs font-bold tabular-nums ${isToday ? "text-primary" : "text-emerald-600"}`}>
                    +{d.earned}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold">Total de la semana</span>
        <span className="flex items-center gap-1.5 text-sm font-bold">
          <span className="text-emerald-600">+{totalEarned}</span>
          <span>🪙</span>
        </span>
      </div>
    </div>
  );
}
