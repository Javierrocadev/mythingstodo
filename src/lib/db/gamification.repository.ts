import { prisma } from "@/lib/db/prisma";

export const gamificationRepository = {
  async findByUser(userId: string) {
    return prisma.gamificationState.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  },

  async addCoins(userId: string, amount: number) {
    return prisma.gamificationState.update({
      where: { userId },
      data: { coins: { increment: amount } },
    });
  },

  async addXp(userId: string, amount: number) {
    return prisma.gamificationState.update({
      where: { userId },
      data: { xp: { increment: amount } },
    });
  },

  async updateDailyProgress(userId: string, increment: number) {
    const state = await prisma.gamificationState.findUnique({ where: { userId } });
    if (!state) return null;

    const today = new Date();
    const lastActive = state.lastActivityDate;
    const isNewDay =
      !lastActive ||
      lastActive.getFullYear() !== today.getFullYear() ||
      lastActive.getMonth() !== today.getMonth() ||
      lastActive.getDate() !== today.getDate();

    return prisma.gamificationState.update({
      where: { userId },
      data: {
        dailyProgress: isNewDay ? increment : { increment },
        lastActivityDate: today,
      },
    });
  },

  async findStreak(userId: string) {
    return prisma.streak.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  },

  async updateStreak(
    userId: string,
    data: { currentStreak: number; longestStreak: number; lastCompletedDate: Date },
  ) {
    return prisma.streak.update({
      where: { userId },
      data,
    });
  },

  async createRewardLog(userId: string, amount: number, reason: string) {
    return prisma.rewardLog.create({
      data: { userId, amount, reason },
    });
  },

  async incrementTotalCompleted(userId: string) {
    return prisma.gamificationState.update({
      where: { userId },
      data: { totalCompleted: { increment: 1 } },
    });
  },

  async checkMilestone(userId: string, totalCompleted: number) {
    if (totalCompleted > 0 && totalCompleted % 50 === 0) {
      const alreadyAwarded = await prisma.rewardLog.findFirst({
        where: { userId, reason: `milestone:${totalCompleted}` },
      });
      if (alreadyAwarded) return null;

      await prisma.gamificationState.update({
        where: { userId },
        data: { coins: { increment: 50 } },
      });
      await prisma.rewardLog.create({
        data: { userId, amount: 50, reason: `milestone:${totalCompleted}` },
      });
      return 50;
    }
    return null;
  },

  async claimDailyReward(userId: string) {
    return prisma.$transaction(async (tx) => {
      const state = await tx.gamificationState.findUnique({ where: { userId } });
      if (!state) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReward = state.lastRewardDate;

      if (lastReward) {
        const lastDay = new Date(lastReward);
        lastDay.setHours(0, 0, 0, 0);
        if (lastDay.getTime() >= today.getTime()) return null;
      }

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      const periodStart = lastReward ?? new Date(0);

      const tasksCompleted = await tx.task.findMany({
        where: {
          userId,
          status: "DONE",
          completedAt: { gte: periodStart, lte: yesterday },
        },
      });

      if (tasksCompleted.length === 0) return null;

      await tx.gamificationState.update({
        where: { userId },
        data: { lastRewardDate: today },
      });

      const coins = tasksCompleted.length * 10;
      const xp = tasksCompleted.reduce((sum, t) => {
        return sum + (t.urgency === "NOW" ? 30 : t.urgency === "TODAY" ? 20 : 10);
      }, 0);

      await tx.gamificationState.update({
        where: { userId },
        data: {
          coins: { increment: coins },
          xp: { increment: xp },
        },
      });

      const dateStr = periodStart.toISOString().slice(0, 10);
      await tx.rewardLog.create({
        data: { userId, amount: coins, reason: `daily_reward:${dateStr}` },
      });

      return { coins, xp, count: tasksCompleted.length };
    });
  },
};
