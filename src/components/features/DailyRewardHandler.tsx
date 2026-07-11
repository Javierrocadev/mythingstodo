"use client";

import { useEffect, useRef } from "react";
import { triggerRewardToast } from "./RewardToast";

interface DailyReward {
  coins: number;
  xp: number;
  count: number;
}

export function DailyRewardHandler({ dailyReward }: { dailyReward: DailyReward | null }) {
  const fired = useRef(false);

  useEffect(() => {
    if (dailyReward && !fired.current) {
      fired.current = true;
      triggerRewardToast({ type: "dailyReward", ...dailyReward });
    }
  }, [dailyReward]);

  return null;
}
