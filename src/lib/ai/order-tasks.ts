import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { scoreTask } from "@/lib/core/task/task-score";

interface AiTaskData {
  id: string;
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  deadline: Date | null;
  estimatedMinutes: number | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PAUSED";
}

const taskItemSchema = z.object({
  id: z.string(),
  emotionalType: z.enum(["SATISFYING", "NORMAL", "BORING", "DRAINING"]),
  estimatedMinutes: z.number().int(),
});

const responseSchema = z.object({
  tasks: z.array(taskItemSchema),
});

const SYSTEM_INSTRUCTION = `You are the task-sorting engine for an anti-burnout productivity app.

You receive a list of the user's pending tasks with their ID, title, urgency level, current emotional type classification, deadline, and estimated duration.

You must:
1. Reorder the tasks according to their apparent logical priority (urgency, deadline proximity, emotional weight).
2. Reclassify each task's emotional type if your analysis suggests a different category would be more accurate based on the title and context.
3. Estimate a realistic duration in minutes for completing each task.

Return only the JSON object containing the array of tasks in their final order. Do not add any text outside the schema.`;

function fallbackSort(tasks: AiTaskData[], now: Date): AiTaskData[] {
  return [...tasks].sort((a, b) => scoreTask(b, now) - scoreTask(a, now));
}

export async function orderTasks(tasks: AiTaskData[], now: Date): Promise<AiTaskData[]> {
  try {
    const prompt = buildPrompt(tasks);

    console.log("[orderTasks] Calling AI with", tasks.length, "tasks");

    const { object } = await generateObject({
      model: google("gemini-3.1-flash-lite"),
      schema: responseSchema,
      system: SYSTEM_INSTRUCTION,
      prompt,
      maxRetries: 2,
    });

    if (!object.tasks || object.tasks.length === 0) {
      console.warn("[orderTasks] AI returned empty — fallback triggered");
      return fallbackSort(tasks, now);
    }

    const idSet = new Set(tasks.map((t) => t.id));
    const ordered = object.tasks
      .filter((aiTask) => idSet.has(aiTask.id))
      .map((aiTask) => {
        const original = tasks.find((t) => t.id === aiTask.id);
        if (!original) return null;
        return {
          ...original,
          emotionalType: aiTask.emotionalType,
          estimatedMinutes: aiTask.estimatedMinutes,
        } as AiTaskData;
      })
      .filter((t): t is AiTaskData => t !== null);

    const remaining = tasks.filter((t) => !object.tasks.some((ai) => ai.id === t.id));

    return [...ordered, ...remaining];
  } catch (err) {
    console.error("[orderTasks] AI call failed — fallback triggered", err);
    return fallbackSort(tasks, now);
  }
}

function buildPrompt(tasks: AiTaskData[]): string {
  const taskList = tasks
    .map((t) => {
      const fields: Record<string, unknown> = {
        id: t.id,
        title: t.title,
        urgency: t.urgency,
        currentEmotionalType: t.emotionalType,
        currentEstimatedMinutes: t.estimatedMinutes,
      };
      if (t.deadline) {
        fields.deadline = t.deadline.toISOString().split("T")[0];
      }
      return JSON.stringify(fields);
    })
    .join(",\n");

  return `Reorder, reclassify, and estimate duration for these tasks:\n[\n${taskList}\n]`;
}
