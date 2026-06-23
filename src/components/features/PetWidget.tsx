"use client";

import { useState } from "react";

const moods = {
  HAPPY: { face: "😸", color: "bg-amber-100", label: "Feliz" },
  NEUTRAL: { face: "😺", color: "bg-orange-50", label: "Neutral" },
  SAD: { face: "😿", color: "bg-slate-100", label: "Triste" },
};

const messages = [
  "¡Una tarea más y hay premio!",
  "Estoy aquí para ayudarte 🐾",
  "Cada pequeña tarea cuenta",
  "Tú puedes con todo",
  "Vamos paso a paso",
  "Me encanta verte en acción",
];

type Mood = keyof typeof moods;
type Size = "full" | "compact";

interface PetWidgetProps {
  mood?: Mood;
  size?: Size;
  message?: string;
}

export function PetWidget({
  mood = "HAPPY",
  size = "full",
  message,
}: PetWidgetProps) {
  const [bubbleText] = useState(() =>
    message ?? messages[Math.floor(Math.random() * messages.length)],
  );
  const currentMood = moods[mood];

  if (size === "compact") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-2xl">{currentMood.face}</span>
        <p className="text-muted-foreground text-xs italic">{bubbleText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="absolute -top-12 left-1/2 w-56 -translate-x-1/2 rounded-2xl bg-white px-4 py-2.5 text-center text-sm shadow-md ring-1 ring-border/50">
          <p className="text-muted-foreground">{bubbleText}</p>
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-white" />
        </div>

        <div
          className={`flex h-32 w-32 items-center justify-center rounded-full ${currentMood.color} shadow-inner`}
        >
          <span className="text-6xl">{currentMood.face}</span>
        </div>
      </div>

      <span className="text-muted-foreground text-xs">{currentMood.label}</span>
    </div>
  );
}
