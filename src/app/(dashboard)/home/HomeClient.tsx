"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { PetWidget } from "@/components/features/PetWidget";
import { TaskCard } from "@/components/features/TaskCard";
import { ProgressBar } from "@/components/features/ProgressBar";
import { DailyEarningsCounter } from "@/components/features/DailyEarningsCounter";
import { triggerRewardToast } from "@/components/features/RewardToast";
import { useOptimisticTasks } from "@/hooks/useOptimisticTask";
import { completeTask } from "@/lib/actions/task.actions";

interface TaskData {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  estimatedMinutes: number | null;
  deadline?: string | null;
  completedAt?: string | null;
}

interface DailyReward {
  coins: number;
  xp: number;
  count: number;
}

interface HomeClientProps {
  tasks: TaskData[];
  petMood: "HAPPY" | "NEUTRAL" | "SAD";
  petType: string;
  accessories: string[];
  decoration: string | null;
  effect: string;
  dailyReward: DailyReward | null;
  todayCompletedCount: number;
}

export function HomeClient({
  tasks: initialTasks,
  petMood,
  petType,
  accessories,
  decoration,
  effect,
  dailyReward,
  todayCompletedCount,
}: HomeClientProps) {
  const { tasks, toggleTask } = useOptimisticTasks(initialTasks);
  const [, startTransition] = useTransition();
  const [celebrating, setCelebrating] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const completedToday = tasks.filter((t) => t.status === "DONE" && t.completedAt?.startsWith(todayStr)).length;
  const activeTask = tasks.find((t) => t.status !== "DONE") ?? null;
  const pendingTasks = tasks.filter((t) => t.status !== "DONE" && t.id !== activeTask?.id);

  useEffect(() => {
    if (dailyReward) {
      triggerRewardToast({ type: "dailyReward", ...dailyReward });
    }
  }, [dailyReward]);

  const handleComplete = useCallback(
    (id: string) => {
      const wasDone = initialTasks.find((t) => t.id === id)?.status === "DONE";
      if (!wasDone) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 1500);
      }
      startTransition(async () => {
        toggleTask(id);
        const result = await completeTask(id);
        if (result?.milestoneCoins) {
          triggerRewardToast({ type: "milestone", coins: result.milestoneCoins });
        }
      });
    },
    [initialTasks, toggleTask],
  );

  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="flex justify-center">
        <PetWidget
          mood={petMood}
          petType={petType}
          accessories={accessories}
          decoration={decoration ?? undefined}
          effect={effect}
          celebrating={celebrating}
        />
      </div>

      <div className="flex flex-col items-center gap-3">
        <ProgressBar
          tasks={tasks.map((t) => ({ id: t.id, urgency: t.urgency, done: t.status === "DONE", completedAt: t.completedAt ?? null }))}
        />
        <DailyEarningsCounter completedToday={completedToday} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">
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

      <section className="flex flex-col gap-2">
        <h3 className="font-heading text-sm font-semibold text-muted-foreground">
          Más tareas
        </h3>
        {pendingTasks.length > 0 ? (
          <div className="flex flex-col gap-2">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>
        ) : (
          activeTask && (
            <p className="text-muted-foreground py-2 text-sm">
              No hay más tareas pendientes
            </p>
          )
        )}
      </section>


    </div>
  );
}
