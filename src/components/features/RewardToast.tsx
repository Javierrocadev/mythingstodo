"use client";

import { toast } from "sonner";

interface RewardToastProps {
  type: "daily" | "levelUp" | "milestone" | "dailyReward";
  coins?: number;
  xp?: number;
  count?: number;
}

export function triggerRewardToast({ type, coins, xp, count }: RewardToastProps) {
  if (type === "dailyReward" && count) {
    toast("🐱 Resumen de ayer", {
      description: `Completaste ${count} tareas · +${coins} monedas · +${xp} XP`,
      duration: 5000,
    });
  } else if (type === "milestone" && coins) {
    toast("🎊 ¡Hito alcanzado!", {
      description: `Has completado ${coins} tareas en total. +${coins} monedas extra`,
      duration: 5000,
    });
  } else if (type === "daily") {
    toast("¡Día completado! 🎉", {
      description: "Has completado todas tus tareas del día",
      duration: 4000,
    });
  } else if (type === "levelUp") {
    toast("¡Has subido de nivel! 🎊", {
      description: "Sigue así, vas genial",
      duration: 4000,
    });
  }
}
