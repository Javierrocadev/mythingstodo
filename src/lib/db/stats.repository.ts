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

export interface DayEarnings {
  day: string;
  label: string;
  earned: number;
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

  async getWeeklyEarnings(userId: string): Promise<DayEarnings[]> {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(monday.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const logs = await prisma.rewardLog.findMany({
      where: {
        userId,
        createdAt: { gte: monday, lte: sunday },
      },
      orderBy: { createdAt: "asc" },
    });

    const dayLabels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const days: DayEarnings[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(date.getDate() + i);
      const dayStr = date.toISOString().slice(0, 10);
      const label = dayLabels[date.getDay()];

      const dayLogs = logs.filter((l) => {
        const logDate = l.reason.startsWith("daily_reward:")
          ? l.reason.split("daily_reward:")[1]
          : l.createdAt.toISOString().slice(0, 10);
        return logDate === dayStr;
      });
      let earned = dayLogs.filter((l) => l.amount > 0).reduce((sum, l) => sum + l.amount, 0);

      if (dayStr === today.toISOString().slice(0, 10)) {
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        const todayDone = await prisma.task.count({
          where: {
            userId,
            status: "DONE",
            completedAt: { gte: todayStart, lte: todayEnd },
          },
        });
        earned += todayDone * 10;
      }

      days.push({ day: dayStr, label, earned });
    }

    return days;
  },
};
