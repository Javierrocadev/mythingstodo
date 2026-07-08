import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";
import { taskRepository } from "@/lib/db/task.repository";
import { gamificationRepository } from "@/lib/db/gamification.repository";
import { petRepository } from "@/lib/db/pet.repository";
import { TasksClient } from "./TasksClient";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [tasks, streak, pet, activeSkin] = await Promise.all([
    taskRepository.findManyByUser(session.user.id),
    gamificationRepository.findStreak(session.user.id),
    petRepository.findByUser(session.user.id),
    petRepository.findActiveSkin(session.user.id),
  ]);

  const dailyReward = await gamificationRepository.claimDailyReward(session.user.id);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCompletedCount = tasks.filter(
    (t) => t.status === "DONE" && t.completedAt?.toISOString().startsWith(todayStr),
  ).length;

  const equippedInventory = await prisma.inventoryItem.findMany({
    where: { userId: session.user.id, isEquipped: true },
    include: { shopItem: true },
  });

  const equippedAccessories = equippedInventory.filter((inv) => inv.shopItem.category === "ACCESSORY");
  const equippedDecoration = equippedInventory.find(
    (inv) => inv.shopItem.category === "DECORATION" && inv.shopItem.imageUrl,
  );
  const equippedAnimation = equippedInventory.find((inv) => inv.shopItem.category === "ANIMATION");

  return (
    <TasksClient
      initialTasks={tasks.map((t) => ({
        id: t.id,
        title: t.title,
        urgency: t.urgency as "NOW" | "TODAY" | "MARGIN",
        emotionalType: t.emotionalType as "SATISFYING" | "NORMAL" | "BORING" | "DRAINING",
        status: t.status as "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED",
        estimatedMinutes: t.estimatedMinutes,
        deadline: t.deadline?.toISOString() ?? null,
        completedAt: t.completedAt?.toISOString() ?? null,
      }))}
      currentStreak={streak.currentStreak}
      longestStreak={streak.longestStreak}
      petMood={(pet?.currentMood ?? "NEUTRAL") as "HAPPY" | "NEUTRAL" | "SAD"}
      petType={activeSkin?.shopItem.imageUrl?.split("/")[2] ?? "orange-cat"}
      accessories={equippedAccessories.map((inv) => inv.shopItem.imageUrl.split("/")[2]?.replace(".json", "") ?? "").filter(Boolean)}
      decoration={equippedDecoration?.shopItem.imageUrl ?? null}
      effect={equippedAnimation?.shopItem.imageUrl.split("/")[2]?.replace(".json", "") ?? "confetti"}
      dailyReward={dailyReward}
      todayCompletedCount={todayCompletedCount}
    />
  );
}
