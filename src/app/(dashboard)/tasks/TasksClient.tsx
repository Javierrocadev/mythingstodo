"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const DragList = dynamic(() => import("@/components/features/DragList").then((m) => m.DragList), {
  ssr: false,
  loading: () => <div className="flex flex-col gap-2">{/* placeholder */}</div>,
});
import { TaskCard } from "@/components/features/TaskCard";
import { NewTaskForm } from "@/components/features/NewTaskForm";
import { FloatingAddButton } from "@/components/features/FloatingAddButton";
import { EmptyState } from "@/components/features/EmptyState";
import { PetWidget } from "@/components/features/PetWidget";
import { StreakIndicator } from "@/components/features/StreakIndicator";
import { ProgressBar } from "@/components/features/ProgressBar";
import { DailyEarningsCounter } from "@/components/features/DailyEarningsCounter";
import { triggerRewardToast } from "@/components/features/RewardToast";
import { useOptimisticTasks, type TaskData } from "@/hooks/useOptimisticTask";
import { useDragOrder } from "@/hooks/useDragOrder";
import { createTask, completeTask, updateTask, aiSuggestOrder, reorderAndEnrich } from "@/lib/actions/task.actions";

interface TasksClientProps {
  initialTasks: TaskData[];
  currentStreak: number;
  longestStreak: number;
  petMood: "HAPPY" | "NEUTRAL" | "SAD";
  petType: string;
  accessories: string[];
  decoration: string | null;
  effect: string;
  todayCompletedCount: number;
}

export function TasksClient({
  initialTasks,
  currentStreak,
  longestStreak,
  petMood,
  petType,
  accessories,
  decoration,
  effect,
  todayCompletedCount,
}: TasksClientProps) {
  const { tasks, toggleTask, addTask, replaceTask, swapTaskId, reorderVisible } = useOptimisticTasks(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const { isDirty, setIsDirty, saveOrder } = useDragOrder();
  const enrichedRef = useRef<Map<string, { emotionalType: string; estimatedMinutes: number | null }>>(new Map());

  const todayStr = new Date().toISOString().slice(0, 10);
  const completedToday = tasks.filter((t) => t.status === "DONE" && t.completedAt?.startsWith(todayStr)).length;
  const todoTasks = tasks.filter((t) => t.status !== "DONE");
  const doneTodayTasks = tasks.filter((t) => t.status === "DONE" && t.completedAt?.startsWith(todayStr));
  const totalCount = tasks.length;
  const taskWeights = { NOW: 3, TODAY: 2, MARGIN: 1 } as const;
  const totalWeight = tasks.reduce((s, t) => s + taskWeights[t.urgency], 0);
  const completedWeight = doneTodayTasks.reduce((s, t) => s + taskWeights[t.urgency], 0);
  const completedCount = doneTodayTasks.length;

  const handleComplete = useCallback((id: string) => {
    const task = initialTasks.find((t) => t.id === id);
    if (task?.status === "DONE") return;

    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 1500);
    setCompletingIds((prev) => new Set(prev).add(id));

    startTransition(async () => {
      const result = await completeTask(id);
      setCompletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toggleTask(id);
      if (result?.milestoneCoins) {
        triggerRewardToast({ type: "milestone", coins: result.milestoneCoins });
      }
    });
  }, [initialTasks, toggleTask]);

  const handleReorder = useCallback((reordered: TaskData[]) => {
    reorderVisible(reordered);
    setIsDirty(true);
  }, [reorderVisible, setIsDirty]);

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
    startTransition(() => {
      if (editingId) {
        replaceTask({
          id: editingId,
          title: data.title,
          urgency: data.urgency,
          emotionalType: data.emotionalType,
          estimatedMinutes: data.estimatedMinutes ?? null,
          deadline: data.deadline ?? null,
          status: "TODO",
        });
        updateTask(editingId, {
          title: data.title,
          urgency: data.urgency,
          emotionalType: data.emotionalType,
          estimatedMinutes: data.estimatedMinutes ?? null,
          deadline: data.deadline ? new Date(data.deadline) : null,
        });
      } else {
        const tempId = `temp-${Date.now()}`;
        addTask({
          id: tempId,
          title: data.title,
          urgency: data.urgency,
          emotionalType: data.emotionalType,
          estimatedMinutes: data.estimatedMinutes ?? null,
          deadline: data.deadline ?? null,
          status: "TODO",
        });
        createTask({
          title: data.title,
          urgency: data.urgency,
          emotionalType: data.emotionalType,
          estimatedMinutes: data.estimatedMinutes ?? null,
          deadline: data.deadline ? new Date(data.deadline) : null,
        }).then((realId) => {
          if (realId) swapTaskId(tempId, {
            id: realId,
            title: data.title,
            urgency: data.urgency,
            emotionalType: data.emotionalType,
            estimatedMinutes: data.estimatedMinutes ?? null,
            deadline: data.deadline ?? null,
            status: "TODO",
          });
        });
      }
    });
    setShowForm(false);
    setEditingId(null);
  }, [editingId, addTask, replaceTask]);

  const handleAiOrder = useCallback(() => {
    setIsOrdering(true);
    startTransition(async () => {
      try {
        const suggested = await aiSuggestOrder();
        enrichedRef.current = new Map(
          suggested.map((t) => [t.id, { emotionalType: t.emotionalType, estimatedMinutes: t.estimatedMinutes }]),
        );
        reorderVisible(suggested as TaskData[]);
        setIsDirty(true);
      } catch {
        // fallback silencioso, se queda el orden actual
      } finally {
        setIsOrdering(false);
      }
    });
  }, [reorderVisible, setIsDirty]);

  const handleSaveOrder = useCallback(() => {
    const orderedIds = todoTasks.map((t) => t.id);
    const enriched = todoTasks
      .filter((t) => enrichedRef.current.has(t.id))
      .map((t) => {
        const ai = enrichedRef.current.get(t.id)!;
        return {
          id: t.id,
          emotionalType: ai.emotionalType,
          estimatedMinutes: ai.estimatedMinutes,
        };
      });

    if (enriched.length > 0) {
      startTransition(() => {
        reorderAndEnrich(orderedIds, enriched);
      });
      enrichedRef.current = new Map();
    } else {
      saveOrder(orderedIds);
    }
  }, [todoTasks, saveOrder]);

  const currentMood =
    completedCount >= totalCount
      ? "HAPPY"
      : petMood;

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <StreakIndicator currentStreak={currentStreak} longestStreak={longestStreak} />
      </div>

      <div className="flex justify-center">
        <PetWidget mood={currentMood} petType={petType} accessories={accessories} decoration={decoration ?? undefined} effect={effect} celebrating={celebrating} />
      </div>

      <div className="flex flex-col items-center gap-3">
        <ProgressBar
          tasks={tasks.map((t) => ({ id: t.id, urgency: t.urgency, done: t.status === "DONE", completedAt: t.completedAt ?? null }))}
        />
        <DailyEarningsCounter completedToday={completedToday} />
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
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
          </motion.div>
        ) : todoTasks.length > 0 ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DragList
              tasks={todoTasks}
              onReorder={handleReorder}
              onComplete={handleComplete}
              onEdit={handleEdit}
              completingIds={completingIds}
            />
            <div className="mt-8 flex justify-center gap-3">
              {todoTasks.length >= 2 && (
                <button
                  onClick={handleAiOrder}
                  disabled={isOrdering}
                  className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                >
                  {isOrdering ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                      Ordenando...
                    </>
                  ) : (
                    "✨ Ordenar con IA"
                  )}
                </button>
              )}
              <button
                onClick={handleSaveOrder}
                disabled={!isDirty}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Guardar orden
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              icon="🎉"
              title="¡Todo listo!"
              description="Has completado todas tus tareas. ¿Quieres añadir alguna más?"
              action={{ label: "Añadir tarea", onClick: () => setShowForm(true) }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {doneTodayTasks.length > 0 && (
        <details className="group">
          <summary className="text-muted-foreground cursor-pointer py-1 text-xs font-medium">
            Completadas hoy ({doneTodayTasks.length})
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            {doneTodayTasks.map((task) => (
              <TaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>
        </details>
      )}

      {!showForm && <FloatingAddButton onClick={() => setShowForm(true)} />}
    </div>
  );
}
