import { auth } from "@/lib/auth/auth.config";
import { taskRepository } from "@/lib/db/task.repository";
import { petRepository } from "@/lib/db/pet.repository";
import { HomeClient } from "./HomeClient";

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [tasks, pet, activeSkin] = await Promise.all([
    taskRepository.findManyByUser(session.user.id),
    petRepository.findByUser(session.user.id),
    petRepository.findActiveSkin(session.user.id),
  ]);

  return (
    <HomeClient
      tasks={tasks.map((t) => ({
        id: t.id,
        title: t.title,
        urgency: t.urgency as "NOW" | "TODAY" | "MARGIN",
        emotionalType: t.emotionalType as "SATISFYING" | "NORMAL" | "BORING" | "DRAINING",
        status: t.status as "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED",
        estimatedMinutes: t.estimatedMinutes,
      }))}
      petMood={(pet?.currentMood ?? "NEUTRAL") as "HAPPY" | "NEUTRAL" | "SAD"}
      petType={activeSkin?.shopItem.imageUrl?.split("/")[2] ?? "orange-cat"}
    />
  );
}
