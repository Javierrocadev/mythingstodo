const MILESTONES = [
  { tasks: 1, label: "1 tarea" },
  { tasks: 5, label: "5 tareas" },
  { tasks: 10, label: "10 tareas" },
  { tasks: 25, label: "25 tareas" },
  { tasks: 50, label: "50 tareas" },
  { tasks: 75, label: "75 tareas" },
  { tasks: 100, label: "100 tareas" },
  { tasks: 150, label: "150 tareas" },
  { tasks: 200, label: "200 tareas" },
  { tasks: 250, label: "250 tareas" },
  { tasks: 300, label: "300 tareas" },
];

function TrophySvg({ earned }: { earned: boolean }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={`h-8 w-8 transition-all ${
        earned
          ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
          : "text-muted-foreground/25"
      }`}
    >
      <path
        d="M14 6h20v4c0 3.5-1 7-4 10-2 2-5 3.5-8 4-3-.5-6-2-8-4-3-3-4-6.5-4-10V6z"
        fill="currentColor"
        opacity={earned ? 1 : 0.6}
      />
      <rect x="17" y="28" width="14" height="5" rx="1" fill="currentColor" opacity={earned ? 1 : 0.6} />
      <rect x="12" y="33" width="24" height="4" rx="2" fill="currentColor" opacity={earned ? 1 : 0.6} />
      <path
        d="M19 6l-3-4h16l-3 4"
        fill="currentColor"
        opacity={earned ? 1 : 0.6}
      />
      <path
        d="M12 12c-2 1.5-4 3-4 5 0 2 1 3.5 2 4.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity={earned ? 0.7 : 0.3}
      />
      <path
        d="M36 12c2 1.5 4 3 4 5 0 2-1 3.5-2 4.5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity={earned ? 0.7 : 0.3}
      />
      {!earned && (
        <rect x="10" y="10" width="28" height="28" rx="3" className="fill-background/60" />
      )}
    </svg>
  );
}

export function TrophyMilestones({ totalCompleted }: { totalCompleted: number }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
        Trofeos {totalCompleted >= 300 ? "completados" : `(${totalCompleted}/300)`}
      </p>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
        {MILESTONES.map((m) => {
          const earned = totalCompleted >= m.tasks;
          return (
            <div
              key={m.tasks}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${
                earned
                  ? "bg-amber-50 ring-1 ring-amber-200/60 dark:bg-amber-950/30 dark:ring-amber-800/40"
                  : "bg-muted/30 ring-1 ring-border/30 opacity-60"
              }`}
            >
              <TrophySvg earned={earned} />
              <span
                className={`text-center text-[10px] font-medium leading-tight ${
                  earned ? "text-amber-800 dark:text-amber-200" : "text-muted-foreground"
                }`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
