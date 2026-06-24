"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";

export async function completeOnboarding(data: {
  workType: string;
  dailyTime: string;
  notifications: string;
  focusMode: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      onboardingWorkType: data.workType,
      onboardingDailyTime: parseInt(data.dailyTime, 10),
      notificationsEnabled: data.notifications === "yes",
      onboardingFocusMode: data.focusMode === "yes",
      onboardingCompleted: true,
    },
  });

  await prisma.pet.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  const defaultSkin = await prisma.shopItem.findFirst({
    where: { category: "PET", price: 0, isActive: true },
  });
  if (defaultSkin) {
    await prisma.inventoryItem.upsert({
      where: {
        userId_shopItemId: {
          userId: session.user.id,
          shopItemId: defaultSkin.id,
        },
      },
      update: { isEquipped: true },
      create: {
        userId: session.user.id,
        shopItemId: defaultSkin.id,
        isEquipped: true,
        equippedAt: new Date(),
      },
    });
  }

  await prisma.streak.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });

  redirect("/home");
}
