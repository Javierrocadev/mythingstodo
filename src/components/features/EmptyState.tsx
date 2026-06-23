"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <span className="text-4xl">{icon}</span>
      <p className="font-heading text-center text-lg font-semibold">{title}</p>
      {description && (
        <p className="text-muted-foreground max-w-xs text-center text-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 rounded-xl px-5 py-2 text-sm font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
