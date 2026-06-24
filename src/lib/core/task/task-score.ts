import { type TaskData } from './task.types';

const URGENCY_BASE = {
  NOW: 100,
  TODAY: 60,
  MARGIN: 20,
} as const;

const EMOTIONAL_MODIFIER = {
  SATISFYING: 10,
  NORMAL: 0,
  BORING: -5,
  DRAINING: 5,
} as const;

export function scoreTask(task: TaskData, now: Date): number {
  const urgencyScore = URGENCY_BASE[task.urgency];
  const emotionalScore = EMOTIONAL_MODIFIER[task.emotionalType];
  const deadlineScore = task.deadline
    ? Math.max(0, 40 - daysUntil(task.deadline, now) * 5)
    : 0;

  return urgencyScore + deadlineScore + emotionalScore;
}

function daysUntil(date: Date, now: Date): number {
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function sortTasksByScore(tasks: TaskData[], now: Date): TaskData[] {
  return [...tasks].sort((a, b) => scoreTask(b, now) - scoreTask(a, now));
}
