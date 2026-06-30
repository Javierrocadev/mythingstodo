import { auth } from "@/lib/auth/auth.config";
import { taskRepository } from "@/lib/db/task.repository";
import { CalendarView } from "@/components/features/CalendarView";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const tasks = await taskRepository.findManyByUser(session.user.id);

  return (
    <CalendarView
      initialTasks={tasks.map((t) => ({
        id: t.id,
        title: t.title,
        urgency: t.urgency as "NOW" | "TODAY" | "MARGIN",
        emotionalType: t.emotionalType as "SATISFYING" | "NORMAL" | "BORING" | "DRAINING",
        status: t.status as "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED",
        deadline: t.deadline ?? undefined,
        estimatedMinutes: t.estimatedMinutes,
      }))}
    />
  );
}
