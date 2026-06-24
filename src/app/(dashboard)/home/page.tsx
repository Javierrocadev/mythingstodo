"use client";

import { useState } from "react";
import { PetWidget } from "@/components/features/PetWidget";
import { TaskCard } from "@/components/features/TaskCard";

type Mood = "HAPPY" | "NEUTRAL" | "SAD";

interface MockTask {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  estimatedMinutes?: number | null;
}

const mockTasks: MockTask[] = [
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
    status: "DONE",
  },
  {
    id: "4",
    title: "Llamar al seguro",
    urgency: "TODAY",
    emotionalType: "DRAINING",
    estimatedMinutes: 20,
    status: "TODO",
  },
];

export default function HomePage() {
  const [tasks, setTasks] = useState(mockTasks);
  const activeTask = tasks.find((t) => t.status !== "DONE") ?? null;
  const completedCount = tasks.filter((t) => t.status === "DONE").length;
  const mood: Mood = completedCount >= 2 ? "HAPPY" : completedCount >= 1 ? "NEUTRAL" : "NEUTRAL";

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "DONE" ? "TODO" : "DONE" } : t,
      ),
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      <PetWidget mood={mood} />

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
