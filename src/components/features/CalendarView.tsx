"use client";

import { useState, useMemo, useCallback, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { NewTaskForm } from "./NewTaskForm";
import { FloatingAddButton } from "./FloatingAddButton";
import { completeTask, updateTask, createTask } from "@/lib/actions/task.actions";

interface CalendarTask {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  deadline?: Date;
  estimatedMinutes?: number | null;
}

interface CalendarViewProps {
  initialTasks: CalendarTask[];
}

function DraggableTaskCard({ task, isDragging }: { task: CalendarTask; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef } =
    useDraggable({
      id: task.id,
      data: { type: "task", task },
    });

  const cardTask = {
    ...task,
    deadline: task.deadline?.toISOString() ?? null,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-30" : ""}
    >
      <TaskCard task={cardTask} />
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

export function CalendarView({ initialTasks }: CalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const dropData = over.data.current as { type: string; date?: Date } | undefined;
    if (!dropData || dropData.type !== "day" || !dropData.date) return;

    const newDeadline = dropData.date;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, deadline: newDeadline } : t)),
    );

    startTransition(() => {
      updateTask(taskId, { deadline: newDeadline });
    });
  }, []);

  const handleComplete = useCallback((id: string) => {
    startTransition(() => {
      completeTask(id);
    });
  }, []);

  const handleSave = useCallback((data: {
    title: string;
    urgency: "NOW" | "TODAY" | "MARGIN";
    emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
    deadline?: string;
    estimatedMinutes?: number;
  }) => {
    const tempId = `temp-${Date.now()}`;
    const savedAt = Date.now();
    setSavingIds((prev) => new Set(prev).add(tempId));
    setShowForm(false);

    createTask({
      title: data.title,
      urgency: data.urgency,
      emotionalType: data.emotionalType,
      estimatedMinutes: data.estimatedMinutes ?? null,
      deadline: data.deadline ? new Date(data.deadline) : null,
    }).then((realId) => {
      const elapsed = Date.now() - savedAt;
      const remaining = Math.max(0, 500 - elapsed);
      setTimeout(() => {
        setSavingIds((prev) => {
          const next = new Set(prev);
          next.delete(tempId);
          return next;
        });
        if (realId) {
          setTasks((prev) => [
            ...prev,
            {
              id: realId,
              title: data.title,
              urgency: data.urgency,
              emotionalType: data.emotionalType,
              estimatedMinutes: data.estimatedMinutes ?? null,
              deadline: data.deadline ? new Date(data.deadline) : undefined,
              status: "TODO",
            },
          ]);
        }
      }, remaining);
    });
  }, []);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className="flex flex-col gap-6 overflow-hidden py-4 md:grid md:grid-cols-2 md:gap-8 md:min-h-[calc(100dvh-12rem)]">
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

        <div className="flex flex-col gap-6 overflow-hidden min-h-0 md:overflow-y-auto">
          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                  <h3 className="font-heading mb-4 text-base font-semibold">
                    Nueva tarea
                  </h3>
                  <NewTaskForm
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

          {savingIds.size > 0 && (
            <div className="flex flex-col gap-2">
              {Array.from(savingIds).map((id) => (
                <div key={id} className="flex items-center gap-1">
                  <div className="flex h-10 w-[34px] shrink-0 items-center justify-center" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-border/50">
                      <div className="h-6 w-6 shrink-0 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!showForm && <FloatingAddButton onClick={() => setShowForm(true)} />}

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
