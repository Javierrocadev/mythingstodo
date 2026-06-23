"use client";

import { useState } from "react";

type Urgency = "NOW" | "TODAY" | "MARGIN";
type EmotionalType = "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";

interface TaskData {
  title: string;
  urgency: Urgency;
  emotionalType: EmotionalType;
  deadline?: string;
  estimatedMinutes?: number;
}

interface NewTaskFormProps {
  initialData?: {
    title?: string;
    urgency?: Urgency;
    emotionalType?: EmotionalType;
    deadline?: string;
    estimatedMinutes?: number | null;
  };
  onSave: (data: TaskData) => void;
  onCancel?: () => void;
}

const urgencyOptions: { value: Urgency; label: string }[] = [
  { value: "NOW", label: "Para ya" },
  { value: "TODAY", label: "Hoy" },
  { value: "MARGIN", label: "Margen" },
];

const emotionalOptions: { value: EmotionalType; label: string; icon: string }[] = [
  { value: "SATISFYING", label: "Satisfactoria", icon: "⭐" },
  { value: "NORMAL", label: "Normal", icon: "📋" },
  { value: "BORING", label: "Aburrida", icon: "😴" },
  { value: "DRAINING", label: "Agotadora", icon: "⚡" },
];

export function NewTaskForm({
  initialData,
  onSave,
  onCancel,
}: NewTaskFormProps) {
  const isEditing = !!initialData?.title;
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [urgency, setUrgency] = useState<Urgency>(initialData?.urgency ?? "TODAY");
  const [emotionalType, setEmotionalType] = useState<EmotionalType>(
    initialData?.emotionalType ?? "NORMAL",
  );
  const [hasDeadline, setHasDeadline] = useState(!!initialData?.deadline);
  const [deadline, setDeadline] = useState(initialData?.deadline ?? "");
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(
    initialData?.estimatedMinutes ?? 0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      urgency,
      emotionalType,
      ...(hasDeadline && deadline ? { deadline } : {}),
      ...(estimatedMinutes > 0 ? { estimatedMinutes } : {}),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="¿Qué tienes que hacer?"
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
        autoFocus
      />

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Urgencia
        </p>
        <div className="flex gap-2">
          {urgencyOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setUrgency(opt.value)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                urgency === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Tipo emocional
        </p>
        <div className="flex flex-wrap gap-2">
          {emotionalOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEmotionalType(opt.value)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                emotionalType === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={hasDeadline}
            onChange={(e) => setHasDeadline(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary accent-primary"
          />
          <span className="text-muted-foreground">Añadir fecha límite</span>
        </label>

        {hasDeadline && (
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
          />
        )}

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Tiempo estimado:
          </span>
          <input
            type="number"
            min={0}
            step={5}
            value={estimatedMinutes || ""}
            onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
            placeholder="min"
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
          <span className="text-muted-foreground text-xs">minutos</span>
        </div>
      </div>

      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={!title.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          {isEditing ? "Guardar cambios" : "Añadir tarea"}
        </button>
      </div>
    </form>
  );
}
