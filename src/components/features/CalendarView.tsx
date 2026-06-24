"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { TaskCard } from "./TaskCard";

interface CalendarTask {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  deadline?: Date;
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
  {
    id: "c6",
    title: "Organizar escritorio",
    urgency: "MARGIN",
    emotionalType: "SATISFYING",
    status: "TODO",
  },
  {
    id: "c7",
    title: "Hacer copia de seguridad",
    urgency: "TODAY",
    emotionalType: "BORING",
    status: "TODO",
  },
  {
    id: "c8",
    title: "Ver curso de Tailwind",
    urgency: "MARGIN",
    emotionalType: "SATISFYING",
    status: "TODO",
    estimatedMinutes: 45,
  },
];

function DraggableTaskCard({ task, isDragging }: { task: CalendarTask; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef } =
    useDraggable({
      id: task.id,
      data: { type: "task", task },
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-30" : ""}
    >
      <TaskCard task={task} />
    </div>
  );
}

function DroppableDayButton(props: React.ComponentProps<typeof CalendarDayButton>) {
  const dateStr = props.day?.date ? format(props.day.date, "yyyy-MM-dd") : "";
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dateStr}`,
    data: { type: "day", date: props.day?.date },
  });

  return (
    <div ref={setNodeRef} className={isOver ? "relative z-10 after:absolute after:inset-0 after:rounded-[inherit] after:ring-2 after:ring-primary after:ring-offset-1" : ""}>
      <CalendarDayButton {...props} />
    </div>
  );
}

export function CalendarView() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState(mockTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeId) ?? null,
    [activeId, tasks],
  );

  const tasksWithDate = useMemo(() => tasks.filter((t) => t.deadline), [tasks]);
  const tasksWithoutDate = useMemo(
    () => tasks.filter((t) => !t.deadline && t.status !== "DONE"),
    [tasks],
  );

  const taskMap = useMemo(() => {
    const map = new Map<string, CalendarTask[]>();
    for (const task of tasksWithDate) {
      const key = format(task.deadline!, "yyyy-MM-dd");
      const existing = map.get(key) ?? [];
      existing.push(task);
      map.set(key, existing);
    }
    return map;
  }, [tasksWithDate]);

  const daysWithTasks = useMemo(
    () => [...taskMap.keys()].map((k) => new Date(k)),
    [taskMap],
  );

  const selectedTasks = selectedDay
    ? taskMap.get(format(selectedDay, "yyyy-MM-dd")) ?? []
    : [];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const dropData = over.data.current as { type: string; date?: Date } | undefined;
    if (!dropData || dropData.type !== "day" || !dropData.date) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, deadline: dropData.date } : t)),
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className="flex flex-col gap-6 overflow-hidden py-4 md:grid md:grid-cols-2 md:gap-8">
        <Calendar
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          locale={es}
          modifiers={{ hasTask: daysWithTasks }}
          modifiersStyles={{
            hasTask: {
              fontWeight: "bold",
              textDecoration: "underline",
              textDecorationColor: "var(--color-primary)",
              textUnderlineOffset: "3px",
            },
          }}
          components={{ DayButton: DroppableDayButton }}
          className="w-full [--cell-size:--spacing(8)] md:[--cell-size:--spacing(12)]"
        />

        <div className="flex flex-col gap-6 overflow-hidden md:max-h-[500px] md:overflow-y-auto">
          <div>
            <h3 className="font-heading mb-3 text-base font-semibold">
              {selectedDay
                ? format(selectedDay, "EEEE d 'de' MMMM", { locale: es })
                : "Selecciona un día"}
            </h3>

            {selectedTasks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {selectedTasks.map((task) => (
                  <DraggableTaskCard key={task.id} task={task} isDragging={activeId === task.id} />
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

          {tasksWithoutDate.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="font-heading mb-3 text-sm font-semibold text-muted-foreground">
                Sin fecha asignada
              </h4>
              <div className="flex flex-col gap-2">
                {tasksWithoutDate.map((task) => (
                  <DraggableTaskCard key={task.id} task={task} isDragging={activeId === task.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeTask ? (
          <div className="flex max-w-[160px] items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-lg ring-1 ring-border/50">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary/50" />
            <span className="truncate text-sm font-medium">{activeTask.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
