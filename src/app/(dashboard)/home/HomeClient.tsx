"use client";

import { useState, useTransition, useCallback } from "react";
import { PetWidget } from "@/components/features/PetWidget";
import { TaskCard } from "@/components/features/TaskCard";
import { useOptimisticTasks } from "@/hooks/useOptimisticTask";
import { completeTask } from "@/lib/actions/task.actions";

interface TaskData {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  estimatedMinutes: number | null;
}

interface HomeClientProps {
  tasks: TaskData[];
  petMood: "HAPPY" | "NEUTRAL" | "SAD";
  petType: string;
  accessories: string[];
  decoration: string | null;
  effect: string;
}

export function HomeClient({ tasks: initialTasks, petMood, petType, accessories, decoration, effect }: HomeClientProps) {
  const { tasks, toggleTask } = useOptimisticTasks(initialTasks);
  const [, startTransition] = useTransition();
  const [celebrating, setCelebrating] = useState(false);

  const activeTask = tasks.find((t) => t.status !== "DONE") ?? null;
  const completedCount = tasks.filter((t) => t.status === "DONE").length;

  const handleComplete = useCallback((id: string) => {
    const wasDone = initialTasks.find((t) => t.id === id)?.status === "DONE";
    if (!wasDone) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 1500);
    }
    startTransition(() => {
      toggleTask(id);
      completeTask(id);
    });
  }, [initialTasks, toggleTask]);

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <PetWidget mood={petMood} petType={petType} accessories={accessories} decoration={decoration ?? undefined} effect={effect} celebrating={celebrating} />

      <section className="w-full">
        <h2 className="font-heading mb-3 text-lg font-semibold">
          {activeTask ? "Tu tarea activa" : "Todo listo ✨"}
        </h2>
        {activeTask ? (
          <TaskCard task={activeTask} onComplete={handleComplete} />
        ) : (
          <p className="text-muted-foreground text-sm">
            Has completado todas tus tareas. ¡Buen trabajo!
          </p>
        )}
      </section>

      <section className="w-full">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-muted-foreground">
            Más tareas
          </h3>
          <span className="text-muted-foreground text-xs">
            {completedCount}/{tasks.length} completadas
          </span>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {tasks
            .filter((t) => t.id !== activeTask?.id)
            .slice(0, 3)
            .map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
        </div>
      </section>
    </div>
  );
}
