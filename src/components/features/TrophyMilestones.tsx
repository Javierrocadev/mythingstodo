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
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-8 w-8 transition-all ${
        earned
          ? "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
          : "text-muted-foreground/25"
      }`}
    >
      <path d="M7 3h10v4a5 5 0 0 1-10 0V3z" opacity={earned ? 1 : 0.5} />
      <path d="M7 4H4.5A2.5 2.5 0 0 0 7 8" opacity={earned ? 1 : 0.5} />
      <path d="M17 4h2.5A2.5 2.5 0 0 1 17 8" opacity={earned ? 1 : 0.5} />
      <path d="M12 12v3" opacity={earned ? 1 : 0.5} />
      <path d="M9 21h6" opacity={earned ? 1 : 0.5} />
      <path d="M10 18h4" opacity={earned ? 1 : 0.5} />
      <path d="M11 15h2" opacity={earned ? 1 : 0.5} />
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
