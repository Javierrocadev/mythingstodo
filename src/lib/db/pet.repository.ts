import { prisma } from "@/lib/db/prisma";
import type { PetMood } from "@prisma/client";

export const petRepository = {
  async findByUser(userId: string) {
    return prisma.pet.findUnique({ where: { userId } });
  },

  async upsertByUser(userId: string) {
    return prisma.pet.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  },

  async updateMood(userId: string, mood: PetMood) {
    return prisma.pet.update({
      where: { userId },
      data: { currentMood: mood },
    });
  },

  async findActiveSkin(userId: string) {
    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: { userId, isEquipped: true, shopItem: { category: "PET" } },
      include: { shopItem: true },
    });
    return inventoryItem ?? null;
  },

  async findEquippedItems(userId: string) {
    return prisma.inventoryItem.findMany({
      where: { userId, isEquipped: true },
      include: { shopItem: true },
    });
  },
};
