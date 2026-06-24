"use client";

import { useState, useTransition, useCallback } from "react";
import { DragList } from "@/components/features/DragList";
import { TaskCard } from "@/components/features/TaskCard";
import { NewTaskForm } from "@/components/features/NewTaskForm";
import { FloatingAddButton } from "@/components/features/FloatingAddButton";
import { EmptyState } from "@/components/features/EmptyState";
import { PetWidget } from "@/components/features/PetWidget";
import { StreakIndicator } from "@/components/features/StreakIndicator";
import { ProgressBar } from "@/components/features/ProgressBar";
import { triggerRewardToast } from "@/components/features/RewardToast";
import { createTask, completeTask, reorderTasks } from "@/lib/actions/task.actions";

interface TaskData {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  estimatedMinutes?: number | null;
  deadline?: string | null;
}

interface TasksClientProps {
  initialTasks: TaskData[];
  currentStreak: number;
  longestStreak: number;
  petMood: "HAPPY" | "NEUTRAL" | "SAD";
  petType: string;
}

export function TasksClient({
  initialTasks,
  currentStreak,
  longestStreak,
  petMood,
  petType,
}: TasksClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const todoTasks = tasks.filter((t) => t.status !== "DONE");
  const doneTasks = tasks.filter((t) => t.status === "DONE");
  const totalCount = tasks.length;
  const completedCount = doneTasks.length;

  const handleComplete = useCallback((id: string) => {
    setTasks((prev) => {
      const isDone = prev.find((t) => t.id === id)?.status === "DONE";
      const newStatus = isDone ? "TODO" as const : "DONE" as const;
      const next: TaskData[] = prev.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t,
      );
      const newDone = next.filter((t) => t.status === "DONE").length;
      if (!isDone && newDone === next.length) {
        triggerRewardToast({ type: "daily" });
      }
      return next;
    });
    startTransition(() => {
      completeTask(id);
    });
  }, []);

  const handleReorder = useCallback((reordered: TaskData[]) => {
    setTasks((prev) => {
      const done = prev.filter((t) => t.status === "DONE");
      return [...reordered, ...done];
    });
  }, []);

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
    setShowForm(true);
  }, []);

  const handleSave = useCallback((data: {
    title: string;
    urgency: "NOW" | "TODAY" | "MARGIN";
    emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
    deadline?: string;
    estimatedMinutes?: number;
  }) => {
    if (editingId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: data.title, urgency: data.urgency, emotionalType: data.emotionalType, estimatedMinutes: data.estimatedMinutes ?? null, deadline: data.deadline ?? null }
            : t,
        ),
      );
    } else {
      const newId = `temp-${Date.now()}`;
      setTasks((prev) => [
        ...prev,
        {
          id: newId,
          title: data.title,
          urgency: data.urgency,
          emotionalType: data.emotionalType,
          estimatedMinutes: data.estimatedMinutes ?? null,
          deadline: data.deadline ?? null,
          status: "TODO" as const,
        },
      ]);
      startTransition(() => {
        createTask({
          title: data.title,
          urgency: data.urgency,
          emotionalType: data.emotionalType,
          estimatedMinutes: data.estimatedMinutes ?? null,
          deadline: data.deadline ? new Date(data.deadline) : null,
        });
      });
    }
    setShowForm(false);
    setEditingId(null);
  }, [editingId]);

  const handleSaveOrder = useCallback(() => {
    const orderedIds = todoTasks.map((t) => t.id);
    startTransition(() => {
      reorderTasks(orderedIds);
    });
  }, [todoTasks]);

  const currentMood =
    completedCount >= totalCount
      ? "HAPPY"
      : petMood;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <ProgressBar completed={completedCount} total={totalCount} />
        <StreakIndicator currentStreak={currentStreak} longestStreak={longestStreak} />
      </div>

      <PetWidget mood={currentMood} size="compact" petType={petType} />

      {showForm ? (
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <h3 className="font-heading mb-4 text-base font-semibold">
            {editingId ? "Editar tarea" : "Nueva tarea"}
          </h3>
          <NewTaskForm
            initialData={
              editingId
                ? (() => {
                    const t = tasks.find((t) => t.id === editingId);
                    return t ? {
                      title: t.title,
                      urgency: t.urgency,
                      emotionalType: t.emotionalType,
                      deadline: t.deadline ?? undefined,
                      estimatedMinutes: t.estimatedMinutes,
                    } : undefined;
                  })()
                : undefined
            }
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          />
        </div>
      ) : todoTasks.length > 0 ? (
        <>
          <DragList
            tasks={todoTasks}
            onReorder={handleReorder}
            onComplete={handleComplete}
            onEdit={handleEdit}
          />
          <div className="flex justify-center">
            <button
              onClick={handleSaveOrder}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2 text-sm font-medium transition-colors"
            >
              Guardar orden
            </button>
          </div>
        </>
      ) : (
        <EmptyState
          icon="🎉"
          title="¡Todo listo!"
          description="Has completado todas tus tareas. ¿Quieres añadir alguna más?"
          action={{ label: "Añadir tarea", onClick: () => setShowForm(true) }}
        />
      )}

      {doneTasks.length > 0 && (
        <details className="group">
          <summary className="text-muted-foreground cursor-pointer py-1 text-xs font-medium">
            Completadas ({doneTasks.length})
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>
        </details>
      )}

      {!showForm && <FloatingAddButton onClick={() => setShowForm(true)} />}
    </div>
  );
}
