import { auth } from "@/lib/auth/auth.config";
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
      }))}
      currentStreak={streak.currentStreak}
      longestStreak={streak.longestStreak}
      petMood={(pet?.currentMood ?? "NEUTRAL") as "HAPPY" | "NEUTRAL" | "SAD"}
      petType={activeSkin?.shopItem.imageUrl?.split("/")[2] ?? "orange-cat"}
    />
  );
}
