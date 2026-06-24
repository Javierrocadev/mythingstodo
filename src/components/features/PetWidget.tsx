"use client";

import { useState, useEffect } from "react";

const moodLabels = { HAPPY: "Feliz", NEUTRAL: "Neutral", SAD: "Triste" } as const;
const moodColors = { HAPPY: "bg-amber-100", NEUTRAL: "bg-orange-50", SAD: "bg-slate-100" } as const;

const messages = [
  "¡Una tarea más y hay premio!",
  "Estoy aquí para ayudarte 🐾",
  "Cada pequeña tarea cuenta",
  "Tú puedes con todo",
  "Vamos paso a paso",
  "Me encanta verte en acción",
];

type Mood = keyof typeof moodLabels;
type Size = "full" | "compact";

interface PetWidgetProps {
  mood?: Mood;
  size?: Size;
  message?: string;
  petType?: string;
}

export function PetWidget({
  mood = "HAPPY",
  size = "full",
  message,
  petType = "orange-cat",
}: PetWidgetProps) {
  const [bubbleText, setBubbleText] = useState(message ?? messages[0]);

  useEffect(() => {
    if (!message) {
      setBubbleText(messages[Math.floor(Math.random() * messages.length)]);
    }
  }, [message]);

  const imgSrc = `/pets/${petType}/${mood.toLowerCase()}.svg`;

  if (size === "compact") {
    return (
      <div className="flex items-center gap-2">
        <img src={imgSrc} alt={moodLabels[mood]} className="h-8 w-auto" />
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
          className={`flex h-40 w-48 items-center justify-center rounded-2xl ${moodColors[mood]} shadow-inner`}
        >
          <img
            src={imgSrc}
            alt={moodLabels[mood]}
            className="h-36 w-full object-contain"
          />
        </div>
      </div>

      <span className="text-muted-foreground text-xs">{moodLabels[mood]}</span>
    </div>
  );
}
