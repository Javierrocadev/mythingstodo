"use client";

import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { TaskCard } from "./TaskCard";

interface CalendarTask {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  deadline: Date;
  estimatedMinutes?: number | null;
}

const mockTasks: CalendarTask[] = [
  {
    id: "c1",
    title: "Preparar presentación del jueves",
    urgency: "NOW",
    emotionalType: "BORING",
    status: "TODO",
    deadline: new Date(2026, 5, 25),
    estimatedMinutes: 60,
  },
  {
    id: "c2",
    title: "Comprar comida del gato",
    urgency: "TODAY",
    emotionalType: "SATISFYING",
    status: "TODO",
    deadline: new Date(2026, 5, 24),
    estimatedMinutes: 15,
  },
  {
    id: "c3",
    title: "Leer capítulo 3 del libro",
    urgency: "MARGIN",
    emotionalType: "SATISFYING",
    status: "TODO",
    deadline: new Date(2026, 6, 1),
    estimatedMinutes: 30,
  },
  {
    id: "c4",
    title: "Llamar al seguro",
    urgency: "TODAY",
    emotionalType: "DRAINING",
    status: "TODO",
    deadline: new Date(2026, 5, 24),
    estimatedMinutes: 20,
  },
  {
    id: "c5",
    title: "Cumpleaños de Ana",
    urgency: "MARGIN",
    emotionalType: "SATISFYING",
    status: "TODO",
    deadline: new Date(2026, 5, 28),
  },
];

export function CalendarView() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState(mockTasks);

  const taskMap = useMemo(() => {
    const map = new Map<string, CalendarTask[]>();
    for (const task of tasks) {
      const key = format(task.deadline, "yyyy-MM-dd");
      const existing = map.get(key) ?? [];
      existing.push(task);
      map.set(key, existing);
    }
    return map;
  }, [tasks]);

  const daysWithTasks = useMemo(
    () => [...taskMap.keys()].map((k) => new Date(k)),
    [taskMap],
  );

  const selectedTasks = selectedDay
    ? taskMap.get(format(selectedDay, "yyyy-MM-dd")) ?? []
    : [];

  const handleDropOnDay = (taskId: string, newDate: Date) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, deadline: newDate } : t)),
    );
  };

  const handleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "DONE" ? "TODO" : "DONE" }
          : t,
      ),
    );
  };

  const handleEdit = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newDeadline = prompt(
      "Nueva fecha (YYYY-MM-DD):",
      format(task.deadline, "yyyy-MM-dd"),
    );
    if (newDeadline) {
      const parsed = new Date(newDeadline);
      if (!isNaN(parsed.getTime())) {
        handleDropOnDay(id, parsed);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        locale={es}
        modifiers={{
          hasTask: daysWithTasks,
        }}
        modifiersStyles={{
          hasTask: {
            fontWeight: "bold",
            textDecoration: "underline",
            textDecorationColor: "var(--color-primary)",
            textUnderlineOffset: "3px",
          },
        }}
        className="mx-auto w-full [--cell-size:--spacing(8)] md:[--cell-size:--spacing(14)]"
      />

      <div>
        <h3 className="font-heading mb-3 text-base font-semibold">
          {selectedDay
            ? format(selectedDay, "EEEE d 'de' MMMM", { locale: es })
            : "Selecciona un día"}
        </h3>

        {selectedTasks.length > 0 ? (
          <div className="flex flex-col gap-2">
            {selectedTasks.map((task) => (
              <div key={task.id} className="relative">
                <button
                  className="absolute -left-1 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground opacity-0 hover:opacity-100"
                  title="Arrastrar a otro día (usa editar)"
                >
                  ⠿
                </button>
                <TaskCard
                  task={task}
                  onComplete={handleComplete}
                  onEdit={handleEdit}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {selectedDay
              ? "No hay tareas para este día"
              : "Selecciona un día para ver sus tareas"}
          </p>
        )}
      </div>
    </div>
  );
}
