"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskSegment {
  id: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  done: boolean;
  completedAt: string | null;
}

interface ProgressBarProps {
  tasks: TaskSegment[];
}

const URGENCY_WEIGHT = { NOW: 3, TODAY: 2, MARGIN: 1 } as const;
const blockColor = {
  NOW: "bg-red-400",
  TODAY: "bg-amber-400",
  MARGIN: "bg-sky-300",
} as const;

function getTodayStr() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function ProgressBar({ tasks }: ProgressBarProps) {
  const todayStr = getTodayStr();
  const completedTodayList = tasks.filter((t) => t.done && t.completedAt?.startsWith(todayStr));
  const completedTodayWeight = completedTodayList.reduce((s, t) => s + URGENCY_WEIGHT[t.urgency], 0);
  const pendingTasks = tasks.filter((t) => !t.done);
  const pendingWeight = pendingTasks.reduce((s, t) => s + URGENCY_WEIGHT[t.urgency], 0);
  const totalWeight = completedTodayWeight + pendingWeight;
  const percentage = totalWeight > 0 ? Math.round((completedTodayWeight / totalWeight) * 100) : 0;
  const completedTodayCount = completedTodayList.length;
  const pendingCount = pendingTasks.length;

  const pendingBlocks = useMemo(() => {
    if (totalWeight === 0) return [];
    const donePct = completedTodayWeight / totalWeight;
    let cursor = donePct;
    return pendingTasks.map((t) => {
      const w = URGENCY_WEIGHT[t.urgency] / totalWeight;
      const start = cursor;
      cursor += w;
      return { id: t.id, urgency: t.urgency, start, width: w };
    });
  }, [pendingTasks, completedTodayWeight, totalWeight]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
      <div className="relative h-8 w-full">
        {/* Inner bar with overflow-hidden to clip blocks with rounded corners */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-muted shadow-inner">
          {/* Completed fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Pending blocks on top of the empty portion */}
          <AnimatePresence>
            {pendingBlocks.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={false}
                animate={{ left: `${b.start * 100}%`, width: `calc(${b.width * 100}%)` }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`absolute top-0 h-full ${blockColor[b.urgency]}`}
                style={{ opacity: 0.35, minWidth: 2, borderRight: "2px solid var(--color-background)" }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Cat indicator - outside overflow-hidden so it's never clipped */}
        <motion.div
          className="absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-amber-300"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ left: `calc(${percentage}% - 20px)`, opacity: percentage > 0 ? 1 : 0, scale: percentage > 0 ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <span className="text-sm">🐱</span>
        </motion.div>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm font-medium">
            {completedTodayCount}/{completedTodayCount + pendingCount} hoy
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-red-400">
              ● {pendingTasks.filter((t) => t.urgency === "NOW").length}
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-500">
              ● {pendingTasks.filter((t) => t.urgency === "TODAY").length}
            </span>
            <span className="flex items-center gap-1 text-xs text-sky-400">
              ● {pendingTasks.filter((t) => t.urgency === "MARGIN").length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="font-heading text-lg font-bold text-amber-600 tabular-nums">
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
