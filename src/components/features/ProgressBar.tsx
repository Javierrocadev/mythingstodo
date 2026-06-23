"use client";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 text-lg transition-all duration-700 ease-out"
          style={{ left: `calc(${percentage}% - 12px)` }}
        >
          🐱
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-muted-foreground text-xs">
          {completed}/{total} tareas
        </span>
        <span className="font-heading text-sm font-bold text-amber-600">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
