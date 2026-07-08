"use client";

interface DailyEarningsCounterProps {
  completedToday: number;
}

export function DailyEarningsCounter({ completedToday }: DailyEarningsCounterProps) {
  const coins = completedToday * 10;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm dark:border-amber-800 dark:bg-amber-950">
      <span className="text-lg">💰</span>
      <span className="font-medium text-amber-800 dark:text-amber-200">
        Hoy: <span className="font-bold">+{coins}</span> monedas
      </span>
    </div>
  );
}
