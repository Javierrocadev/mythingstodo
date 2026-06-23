"use client";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25 fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg transition-all active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-6 w-6"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
