import { prisma } from "@/lib/db/prisma";

export interface StatsSummary {
  totalCompleted: number;
  xp: number;
  level: number;
  coins: number;
  currentStreak: number;
  longestStreak: number;
  coinsEarned: number;
  coinsSpent: number;
  tasksByUrgency: { urgency: string; count: number }[];
  tasksByEmotionalType: { emotionalType: string; count: number }[];
}

export const statsRepository = {
  async getSummary(userId: string): Promise<StatsSummary> {
    const [gamification, streak, rewardAgg, tasksByUrgency, tasksByEmotion] =
      await Promise.all([
        prisma.gamificationState.upsert({
          where: { userId },
          update: {},
          create: { userId },
        }),
        prisma.streak.upsert({
          where: { userId },
          update: {},
          create: { userId },
        }),
        prisma.rewardLog.groupBy({
          by: ["amount"],
          where: { userId },
          _sum: { amount: true },
        }),
        prisma.task.groupBy({
          by: ["urgency"],
          where: { userId, status: "DONE" },
          _count: { id: true },
        }),
        prisma.task.groupBy({
          by: ["emotionalType"],
          where: { userId, status: "DONE" },
          _count: { id: true },
        }),
      ]);

    const coinsEarned = rewardAgg
      .filter((r) => r.amount > 0)
      .reduce((sum, r) => sum + (r._sum.amount ?? 0), 0);

    const coinsSpent = rewardAgg
      .filter((r) => r.amount < 0)
      .reduce((sum, r) => sum + Math.abs(r._sum.amount ?? 0), 0);

    return {
      totalCompleted: gamification.totalCompleted,
      xp: gamification.xp,
      level: gamification.level,
      coins: gamification.coins,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      coinsEarned,
      coinsSpent,
      tasksByUrgency: tasksByUrgency.map((t) => ({
        urgency: t.urgency,
        count: t._count.id,
      })),
      tasksByEmotionalType: tasksByEmotion.map((t) => ({
        emotionalType: t.emotionalType,
        count: t._count.id,
      })),
    };
  },
};
