"use client";

import { useState, useCallback } from "react";
import { reorderTasks } from "@/lib/actions/task.actions";

export function useDragOrder() {
  const [isDirty, setIsDirty] = useState(false);

  const saveOrder = useCallback((taskIds: string[]) => {
    setIsDirty(false);
    reorderTasks(taskIds);
  }, []);

  return { isDirty, setIsDirty, saveOrder };
}
