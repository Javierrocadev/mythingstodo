"use client";

import Lottie from "lottie-react";
import { getEffect } from "@/lib/animations/effects/registry";

interface EffectOverlayProps {
  effect?: string;
  preview?: boolean;
}

export function EffectOverlay({ effect = "confetti", preview = false }: EffectOverlayProps) {
  const effectData = getEffect(effect);
  if (!effectData) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <Lottie animationData={effectData} loop={preview} className="h-full w-full" />
    </div>
  );
}
