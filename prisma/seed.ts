import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "test@mythingstodo.app",
      name: "Michi",
      onboardingCompleted: true,
      onboardingWorkType: "both",
      onboardingDailyTime: 30,
      energy: 100,
      burnout: 0,
    },
  });

  await prisma.pet.create({
    data: {
      userId: user.id,
      currentMood: "HAPPY",
    },
  });

  await prisma.gamificationState.create({
    data: {
      userId: user.id,
      coins: 50,
      xp: 120,
      level: 2,
      dailyProgress: 0,
    },
  });

  await prisma.streak.create({
    data: {
      userId: user.id,
      currentStreak: 3,
      longestStreak: 5,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        userId: user.id,
        title: "Preparar presentación del jueves",
        urgency: "NOW",
        emotionalType: "BORING",
        estimatedMinutes: 60,
        status: "TODO",
        order: 1,
      },
      {
        userId: user.id,
        title: "Comprar comida del gato",
        urgency: "TODAY",
        emotionalType: "SATISFYING",
        estimatedMinutes: 15,
        status: "TODO",
        order: 2,
      },
      {
        userId: user.id,
        title: "Leer capítulo 3 del libro",
        urgency: "MARGIN",
        emotionalType: "SATISFYING",
        estimatedMinutes: 30,
        deadline: new Date("2026-07-01"),
        status: "TODO",
        order: 3,
      },
      {
        userId: user.id,
        title: "Llamar al seguro",
        urgency: "TODAY",
        emotionalType: "DRAINING",
        estimatedMinutes: 20,
        status: "TODO",
        order: 4,
      },
    ],
  });

  const defaultCat = await prisma.shopItem.create({
    data: {
      name: "Gato Naranja",
      category: "PET",
      price: 0,
      imageUrl: "/pets/orange-cat/happy.svg",
      isActive: true,
    },
  });

  await prisma.shopItem.createMany({
    data: [
      {
        name: "Sombrero de Chef",
        category: "ACCESSORY",
        price: 100,
        imageUrl: "/accessories/chef-hat.svg",
        isActive: true,
      },
      {
        name: "Gafas de Sol",
        category: "ACCESSORY",
        price: 75,
        imageUrl: "/accessories/sunglasses.svg",
        isActive: true,
      },
      {
        name: "Fondo de Bosque",
        category: "DECORATION",
        price: 200,
        imageUrl: "/decorations/forest-bg.svg",
        isActive: true,
      },
    ],
  });

  await prisma.inventoryItem.create({
    data: {
      userId: user.id,
      shopItemId: defaultCat.id,
      isEquipped: true,
      equippedAt: new Date(),
    },
  });

  await prisma.rewardLog.create({
    data: {
      userId: user.id,
      amount: 50,
      reason: "onboarding_bonus",
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
