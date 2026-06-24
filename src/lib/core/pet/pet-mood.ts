export type Mood = 'happy' | 'neutral' | 'sad';

export function calculateMood(streak: number, dailyProgress: number): Mood {
  if (streak >= 3 && dailyProgress > 0) return 'happy';
  if (streak === 0 && dailyProgress === 0) return 'sad';
  return 'neutral';
}
