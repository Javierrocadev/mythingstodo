"use client";

import { useOptimistic, useCallback } from "react";

export interface TaskData {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
  estimatedMinutes?: number | null;
  deadline?: string | null;
}

type Action =
  | { type: "toggle"; id: string }
  | { type: "create"; task: TaskData }
  | { type: "replace"; task: TaskData }
  | { type: "reorder"; tasks: TaskData[] };

function tasksReducer(state: TaskData[], action: Action): TaskData[] {
  switch (action.type) {
    case "toggle":
      return state.map((t) =>
        t.id === action.id
          ? { ...t, status: t.status === "DONE" ? "TODO" : "DONE" }
          : t,
      );
    case "create":
      return [...state, action.task];
    case "replace":
      return state.map((t) => (t.id === action.task.id ? action.task : t));
    case "reorder":
      return [...action.tasks, ...state.filter((t) => t.status === "DONE")];
    default:
      return state;
  }
}

export function useOptimisticTasks(initialTasks: TaskData[]) {
  const [optimisticTasks, addOptimistic] = useOptimistic(initialTasks, tasksReducer);

  const toggleTask = useCallback(
    (id: string) => addOptimistic({ type: "toggle", id }),
    [addOptimistic],
  );

  const addTask = useCallback(
    (task: TaskData) => addOptimistic({ type: "create", task }),
    [addOptimistic],
  );

  const replaceTask = useCallback(
    (task: TaskData) => addOptimistic({ type: "replace", task }),
    [addOptimistic],
  );

  const reorderVisible = useCallback(
    (tasks: TaskData[]) => addOptimistic({ type: "reorder", tasks }),
    [addOptimistic],
  );

  return { tasks: optimisticTasks, toggleTask, addTask, replaceTask, reorderVisible };
}
