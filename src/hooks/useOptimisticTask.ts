"use client";

import { useReducer, useCallback } from "react";

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
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  const toggleTask = useCallback(
    (id: string) => dispatch({ type: "toggle", id }),
    [],
  );

  const addTask = useCallback(
    (task: TaskData) => dispatch({ type: "create", task }),
    [],
  );

  const replaceTask = useCallback(
    (task: TaskData) => dispatch({ type: "replace", task }),
    [],
  );

  const reorderVisible = useCallback(
    (tasks: TaskData[]) => dispatch({ type: "reorder", tasks }),
    [],
  );

  return { tasks, toggleTask, addTask, replaceTask, reorderVisible };
}
