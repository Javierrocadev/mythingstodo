"use client";

type Urgency = "NOW" | "TODAY" | "MARGIN";
type EmotionalType = "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";

interface Task {
  id: string;
  title: string;
  urgency: Urgency;
  emotionalType: EmotionalType;
  status: TaskStatus;
  estimatedMinutes?: number | null;
  deadline?: string | null;
}

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const urgencyStyles: Record<Urgency, { label: string; style: string }> = {
  NOW: { label: "Para ya", style: "border-l-4 border-rose-400 bg-rose-50/50" },
  TODAY: {
    label: "Hoy",
    style: "border-l-4 border-amber-400 bg-amber-50/50",
  },
  MARGIN: {
    label: "Margen",
    style: "border-l-4 border-sky-400 bg-sky-50/50",
  },
};

const emotionalIcons: Record<EmotionalType, { icon: string; label: string }> = {
  SATISFYING: { icon: "⭐", label: "Satisfactoria" },
  NORMAL: { icon: "📋", label: "Normal" },
  BORING: { icon: "😴", label: "Aburrida" },
  DRAINING: { icon: "⚡", label: "Agotadora" },
};

function getDeadlineInfo(deadline: string | null): { label: string; className: string } | null {
  if (!deadline) return null;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
  const diffMs = targetDay.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: "Vencida", className: "bg-red-100 text-red-700" };
  if (diffDays === 0) return { label: "Hoy", className: "bg-rose-100 text-rose-700" };
  if (diffDays === 1) return { label: "Mañana", className: "bg-amber-100 text-amber-700" };
  if (diffDays <= 7) return { label: `En ${diffDays}d`, className: "bg-sky-100 text-sky-700" };
  return { label: `En ${diffDays}d`, className: "bg-emerald-100 text-emerald-700" };
}

export function TaskCard({ task, onComplete, onEdit }: TaskCardProps) {
  const isCompleted = task.status === "DONE";
  const urgency = urgencyStyles[task.urgency];
  const emotion = emotionalIcons[task.emotionalType];
  const deadlineInfo = !isCompleted ? getDeadlineInfo(task.deadline ?? null) : null;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-border/50 transition-all ${
        isCompleted ? "opacity-60" : urgency.style
      }`}
    >
      <button
        onClick={() => onComplete?.(task.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          isCompleted
            ? "border-emerald-400 bg-emerald-400 text-white"
            : "border-muted-foreground/30 hover:border-primary"
        }`}
      >
        {isCompleted && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              fillRule="evenodd"
              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`truncate text-sm font-medium ${
              isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </p>
          {!isCompleted && task.urgency === "NOW" && (
            <span className="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600 uppercase">
              Urgente
            </span>
          )}
          {deadlineInfo && (
            <span className={`ml-auto shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${deadlineInfo.className}`}>
              {deadlineInfo.label}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs" title={emotion.label}>
            {emotion.icon}
          </span>
          <span className="text-muted-foreground text-xs">{urgency.label}</span>
          {task.estimatedMinutes ? (
            <span className="text-muted-foreground text-xs">
              · {task.estimatedMinutes}min
            </span>
          ) : null}
        </div>
      </div>

      {onEdit && !isCompleted ? (
        <button
          onClick={() => onEdit(task.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
