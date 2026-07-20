"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";
import { canEquip } from "@/lib/core/gamification/equip-rules";
import { gamificationRepository } from "@/lib/db/gamification.repository";
import { petRepository } from "@/lib/db/pet.repository";

export async function equipItem(shopItemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  const inventoryItem = await prisma.inventoryItem.findUnique({
    where: {
      userId_shopItemId: {
        userId: session.user.id,
        shopItemId,
      },
    },
    include: { shopItem: true },
  });
  if (!inventoryItem) throw new Error("Item no adquirido");

  const allEquipped = await petRepository.findEquippedItems(session.user.id);
  const currentEquipped = allEquipped.map((e) => ({
    category: e.shopItem.category as "PET" | "ANIMATION" | "DECORATION" | "ACCESSORY",
  }));

  const category = inventoryItem.shopItem.category as "PET" | "ANIMATION" | "DECORATION" | "ACCESSORY";

  if (!inventoryItem.isEquipped) {
    if (category === "PET") {
      await prisma.inventoryItem.updateMany({
        where: { userId: session.user.id, isEquipped: true, shopItem: { category: "PET" } },
        data: { isEquipped: false, equippedAt: null },
      });
    } else if (category === "ANIMATION") {
      await prisma.inventoryItem.updateMany({
        where: { userId: session.user.id, isEquipped: true, shopItem: { category: "ANIMATION" } },
        data: { isEquipped: false, equippedAt: null },
      });
    } else if (category === "DECORATION") {
      await prisma.inventoryItem.updateMany({
        where: { userId: session.user.id, isEquipped: true, shopItem: { category: "DECORATION" } },
        data: { isEquipped: false, equippedAt: null },
      });
    } else if (!canEquip(currentEquipped, category)) {
      throw new Error("Límite de equipamiento alcanzado");
    }

    await prisma.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: { isEquipped: true, equippedAt: new Date() },
    });
  } else {
    await prisma.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: { isEquipped: false, equippedAt: null },
    });
  }

  revalidatePath("/shop");
  revalidatePath("/home");
}

export async function purchaseItem(shopItemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  const shopItem = await prisma.shopItem.findUnique({ where: { id: shopItemId } });
  if (!shopItem || !shopItem.isActive) throw new Error("Item no disponible");

  const gState = await gamificationRepository.findByUser(session.user.id);
  if (gState.coins < shopItem.price) throw new Error("Monedas insuficientes");

  const existing = await prisma.inventoryItem.findUnique({
    where: {
      userId_shopItemId: {
        userId: session.user.id,
        shopItemId,
      },
    },
  });
  if (existing) throw new Error("Ya tienes este item");

  await prisma.$transaction([
    prisma.gamificationState.update({
      where: { userId: session.user.id },
      data: { coins: { decrement: shopItem.price } },
    }),
    prisma.inventoryItem.create({
      data: {
        userId: session.user.id,
        shopItemId,
      },
    }),
    prisma.rewardLog.create({
      data: {
        userId: session.user.id,
        amount: -shopItem.price,
        reason: `purchased:${shopItemId}`,
      },
    }),
  ]);

  revalidatePath("/shop");
}

export async function unequipAllAccessories() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  await prisma.inventoryItem.updateMany({
    where: {
      userId: session.user.id,
      isEquipped: true,
      shopItem: { category: "ACCESSORY" },
    },
    data: { isEquipped: false, equippedAt: null },
  });

  revalidatePath("/shop");
  revalidatePath("/home");
}
