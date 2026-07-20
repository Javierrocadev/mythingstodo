import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Uso: npx tsx prisma/seed-dev.ts email@...");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("Usuario no encontrado:", email);
    process.exit(1);
  }

  // Clean previous dev data
  await prisma.rewardLog.deleteMany({ where: { userId: user.id } });
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.streak.deleteMany({ where: { userId: user.id } });
  await prisma.gamificationState.deleteMany({ where: { userId: user.id } });

  const taskTitles = [
    "Hacer la compra",
    "Responder emails del trabajo",
    "Estudiar Next.js",
    "Limpiar la cocina",
    "Leer 10 páginas del libro",
    "Revisar presupuesto mensual",
    "Llamar al médico",
    "Organizar el escritorio",
    "Meditación 5 minutos",
    "Actualizar el CV",
    "Regar las plantas",
    "Planificar la semana",
  ];

  const urgencies = ["NOW", "TODAY", "MARGIN"] as const;
  const emotions = ["SATISFYING", "NORMAL", "BORING", "DRAINING"] as const;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 12 DONE tasks across 5 days (days 4,3,2,1,0 = today)
  for (let i = 0; i < 12; i++) {
    const dayOffset = Math.floor(i / 3);
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(10 + Math.floor(i / 3), (i * 17) % 60);

    await prisma.task.create({
      data: {
        userId: user.id,
        title: taskTitles[i],
        urgency: urgencies[i % 3],
        emotionalType: emotions[i % 4],
        estimatedMinutes: 15 + (i * 5) % 30,
        status: "DONE",
        order: i,
        completedAt: date,
        createdAt: new Date(date.getTime() - 3600000),
      },
    });

    await prisma.rewardLog.create({
      data: {
        userId: user.id,
        amount: urgencies[i % 3] === "NOW" ? 30 : urgencies[i % 3] === "TODAY" ? 20 : 10,
        reason: `task_completed:${taskTitles[i]}`,
        createdAt: date,
      },
    });
  }

  // 3 TODO tasks
  const pendingTasks = [
    { title: "Preparar presentación del proyecto", urgency: "NOW" as const, emotion: "DRAINING" as const },
    { title: "Comprar regalo de cumpleaños", urgency: "TODAY" as const, emotion: "SATISFYING" as const },
    { title: "Organizar fotos del viaje", urgency: "MARGIN" as const, emotion: "NORMAL" as const },
  ];

  for (let i = 0; i < pendingTasks.length; i++) {
    await prisma.task.create({
      data: {
        userId: user.id,
        title: pendingTasks[i].title,
        urgency: pendingTasks[i].urgency,
        emotionalType: pendingTasks[i].emotion,
        estimatedMinutes: 20 + i * 10,
        status: "TODO",
        order: i + 12,
      },
    });
  }

  // GamificationState
  await prisma.gamificationState.create({
    data: {
      userId: user.id,
      coins: 400,
      xp: 350,
      level: 3,
      totalCompleted: 12,
      dailyProgress: 3,
      lastActivityDate: today,
      lastRewardDate: today,
    },
  });

  // Streak
  const streakStart = new Date(today);
  streakStart.setDate(streakStart.getDate() - 4);
  await prisma.streak.create({
    data: {
      userId: user.id,
      currentStreak: 5,
      longestStreak: 5,
      lastCompletedDate: today,
    },
  });

  console.log(`Datos insertados para ${email}`);
  console.log(`  - 12 tareas DONE (${taskTitles.length})`);
  console.log(`  - 3 tareas TODO`);
  console.log(`  - Streak: 5 días`);
  console.log(`  - Coins: 400, XP: 350, Level: 3`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
