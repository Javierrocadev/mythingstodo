"use client";

import { useState } from "react";
import { DragList } from "@/components/features/DragList";
import { TaskCard } from "@/components/features/TaskCard";
import { NewTaskForm } from "@/components/features/NewTaskForm";
import { FloatingAddButton } from "@/components/features/FloatingAddButton";
import { EmptyState } from "@/components/features/EmptyState";
import { PetWidget } from "@/components/features/PetWidget";
import { StreakIndicator } from "@/components/features/StreakIndicator";
import { ProgressBar } from "@/components/features/ProgressBar";
import { triggerRewardToast } from "@/components/features/RewardToast";

interface Task {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  estimatedMinutes?: number | null;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Preparar presentación del jueves",
    urgency: "NOW",
    emotionalType: "BORING",
    estimatedMinutes: 60,
    status: "TODO",
  },
  {
    id: "2",
    title: "Comprar comida del gato",
    urgency: "TODAY",
    emotionalType: "SATISFYING",
    estimatedMinutes: 15,
    status: "TODO",
  },
  {
    id: "3",
    title: "Leer capítulo 3 del libro",
    urgency: "MARGIN",
    emotionalType: "SATISFYING",
    estimatedMinutes: 30,
    status: "TODO",
  },
  {
    id: "4",
    title: "Llamar al seguro",
    urgency: "TODAY",
    emotionalType: "DRAINING",
    estimatedMinutes: 20,
    status: "TODO",
  },
  {
    id: "5",
    title: "Regar las plantas",
    urgency: "MARGIN",
    emotionalType: "NORMAL",
    status: "TODO",
  },
  {
    id: "6",
    title: "Escribir email al profe",
    urgency: "TODAY",
    emotionalType: "BORING",
    estimatedMinutes: 10,
    status: "DONE",
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const todoTasks = tasks.filter((t) => t.status !== "DONE");
  const doneTasks = tasks.filter((t) => t.status === "DONE");
  const totalCount = tasks.length;
  const completedCount = doneTasks.length;

  const handleComplete = (id: string) => {
    setTasks((prev) => {
      const newStatus = prev.find((t) => t.id === id)?.status === "DONE" ? "TODO" as const : "DONE" as const;
      const next: Task[] = prev.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t,
      );
      const newDone = next.filter((t) => t.status === "DONE").length;
      if (newDone > completedCount && newDone === totalCount) {
        triggerRewardToast({ type: "daily" });
      }
      return next;
    });
  };

  const handleReorder = (reordered: Task[]) => {
    setTasks((prev) => {
      const done = prev.filter((t) => t.status === "DONE");
      return [...reordered, ...done];
    });
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleSave = (data: {
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
            ? { ...t, title: data.title, urgency: data.urgency, emotionalType: data.emotionalType, estimatedMinutes: data.estimatedMinutes ?? null }
            : t,
        ),
      );
    } else {
      setTasks((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          title: data.title,
          urgency: data.urgency,
          emotionalType: data.emotionalType,
          estimatedMinutes: data.estimatedMinutes ?? null,
          status: "TODO" as const,
        },
      ]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const currentMood =
    completedCount >= totalCount
      ? "HAPPY"
      : "NEUTRAL";

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <ProgressBar completed={completedCount} total={totalCount} />
        <StreakIndicator currentStreak={3} longestStreak={5} />
      </div>

      <PetWidget mood={currentMood} size="compact" />

      {showForm ? (
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <h3 className="font-heading mb-4 text-base font-semibold">
            {editingId ? "Editar tarea" : "Nueva tarea"}
          </h3>
          <NewTaskForm
            initialData={
              editingId
                ? tasks.find((t) => t.id === editingId)
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
        <DragList
          tasks={todoTasks}
          onReorder={handleReorder}
          onComplete={handleComplete}
          onEdit={handleEdit}
        />
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
