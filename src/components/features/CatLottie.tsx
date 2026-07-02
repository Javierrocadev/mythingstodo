"use client";

import { useEffect, useRef, useMemo } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { mergeLottie } from "@/lib/core/lottie-merge";
import catOrangeNeutral from "@/lib/animations/cat-idle.json";
import catOrangeHappy from "@/lib/animations/cat-happy.json";
import catOrangeSad from "@/lib/animations/cat-sad.json";
import catBlackNeutral from "@/lib/animations/cat-black.json";
import catBlackHappy from "@/lib/animations/cat-black-happy.json";
import catBlackSad from "@/lib/animations/cat-black-sad.json";
import { getAccessory } from "@/lib/animations/registry";

const catAnimations: Record<string, Record<string, object>> = {
  "orange-cat": { NEUTRAL: catOrangeNeutral, HAPPY: catOrangeHappy, SAD: catOrangeSad },
  "black-cat": { NEUTRAL: catBlackNeutral, HAPPY: catBlackHappy, SAD: catBlackSad },
};

const fallbacks: Record<string, string> = {
  "tabby-cat": "orange-cat",
  "white-cat": "orange-cat",
};

interface CatLottieProps {
  mood?: "HAPPY" | "NEUTRAL" | "SAD";
  petType?: string;
  accessories?: string[];
  celebrating?: boolean;
  className?: string;
}

export function CatLottie({
  mood = "NEUTRAL",
  petType = "orange-cat",
  accessories = [],
  celebrating = false,
  className = "",
}: CatLottieProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const resolvedType = catAnimations[petType] ? petType : fallbacks[petType] ?? "orange-cat";
  const baseData = catAnimations[resolvedType]?.[mood] ?? catAnimations[resolvedType]?.NEUTRAL;

  const overlayData = useMemo(
    () => accessories.map((name) => getAccessory(name)).filter(Boolean) as object[],
    [accessories],
  );

  const animationData = useMemo(
    () => mergeLottie(baseData, overlayData),
    [baseData, overlayData],
  );

  const mergeKey = `${resolvedType}-${mood}-${accessories.join(",")}`;

  useEffect(() => {
    if (!lottieRef.current) return;
    lottieRef.current.setSpeed(celebrating ? 1 : 0.5);
  }, [celebrating]);

  return (
    <Lottie
      key={mergeKey}
      lottieRef={lottieRef}
      animationData={animationData}
      loop={true}
      initialSegment={[11, 61]}
      className={className}
    />
  );
}
