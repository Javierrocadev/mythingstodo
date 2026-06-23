"use client";

interface StreakIndicatorProps {
  currentStreak?: number;
  longestStreak?: number;
}

export function StreakIndicator({
  currentStreak = 0,
  longestStreak = 0,
}: StreakIndicatorProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 shadow-sm ring-1 ring-amber-200/30">
      <span className="text-lg">🔥</span>
      <div>
        <span className="font-heading text-lg font-bold text-amber-700">
          {currentStreak}
        </span>
        <span className="ml-1 text-xs text-amber-600">días</span>
      </div>
      {longestStreak > currentStreak && (
        <span className="text-muted-foreground ml-2 text-xs">
          · mejor: {longestStreak}
        </span>
      )}
    </div>
  );
}
