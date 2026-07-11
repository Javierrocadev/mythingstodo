"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPetMessage } from "@/lib/ai/pet-messages";
import { CatLottie } from "./CatLottie";
import { EffectOverlay } from "./EffectOverlay";

const moodLabels = { HAPPY: "Feliz", NEUTRAL: "Neutral", SAD: "Triste" } as const;
const moodColors = { HAPPY: "bg-amber-100", NEUTRAL: "bg-orange-50", SAD: "bg-slate-100" } as const;

const defaultMessages = {
  HAPPY: "¡Una tarea más y hay premio!",
  NEUTRAL: "Estoy aquí para ayudarte 🐾",
  SAD: "Siempre puedes empezar de nuevo",
} as const;

type Mood = keyof typeof moodLabels;
type Size = "full" | "compact";

interface PetWidgetProps {
  mood?: Mood;
  size?: Size;
  message?: string;
  petType?: string;
  accessories?: string[];
  decoration?: string;
  effect?: string;
  celebrating?: boolean;
}

const containerVariants = {
  idle: {
    scale: [1, 1.02, 1],
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" as const },
  },
  celebrating: {
    scale: [1, 1.08, 1],
    rotate: [0, -3, 3, 0],
    transition: { duration: 0.5 },
  },
};

export function PetWidget({
  mood = "HAPPY",
  size = "full",
  message,
  petType = "orange-cat",
  accessories = [],
  decoration,
  effect = "confetti",
  celebrating = false,
}: PetWidgetProps) {
  const [bubbleText, setBubbleText] = useState(message ?? defaultMessages[mood]);

  useEffect(() => {
    setBubbleText(message ?? getPetMessage(mood));
  }, [message, mood]);

  if (size === "compact") {
    return (
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-8 w-auto">
          <CatLottie mood={mood} petType={petType} accessories={accessories} celebrating={celebrating} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={bubbleText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted-foreground text-xs italic"
          >
            {bubbleText}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-12 left-1/2 z-20 w-56 -translate-x-1/2 rounded-2xl bg-white px-4 py-2.5 text-center text-sm shadow-md ring-1 ring-border/50"
          >
            <p className="text-muted-foreground">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className={`relative flex h-40 w-48 items-center justify-center rounded-2xl ${moodColors[mood]} shadow-inner`}
          style={decoration && decoration !== "" ? { backgroundImage: `url(${decoration})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          variants={containerVariants}
          animate={celebrating ? "celebrating" : "idle"}
        >
          <div className="flex h-36 w-full items-center justify-center">
            <CatLottie mood={mood} petType={petType} accessories={accessories} celebrating={celebrating} />
          </div>

          {celebrating && <EffectOverlay effect={effect} />}
        </motion.div>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            mood === "HAPPY" ? "bg-amber-400" : mood === "NEUTRAL" ? "bg-orange-300" : "bg-slate-300"
          }`}
        />
        <span className="text-muted-foreground text-xs">{moodLabels[mood]}</span>
      </div>
    </motion.div>
  );
}
