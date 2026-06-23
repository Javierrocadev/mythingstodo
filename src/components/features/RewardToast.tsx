"use client";

import { toast } from "sonner";

interface RewardToastProps {
  type: "daily" | "levelUp";
}

export function triggerRewardToast({ type }: RewardToastProps) {
  if (type === "daily") {
    toast("¡Día completado! 🎉", {
      description: "Has completado todas tus tareas del día",
      duration: 4000,
    });
  } else {
    toast("¡Has subido de nivel! 🎊", {
      description: "Sigue así, vas genial",
      duration: 4000,
    });
  }
}
