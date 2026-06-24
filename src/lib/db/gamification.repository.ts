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
};
