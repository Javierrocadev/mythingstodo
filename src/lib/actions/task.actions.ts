"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth.config";
import { taskRepository } from "@/lib/db/task.repository";
import { gamificationRepository } from "@/lib/db/gamification.repository";
import { petRepository } from "@/lib/db/pet.repository";
import { calculateMood } from "@/lib/core/pet/pet-mood";
import type { PetMood } from "@prisma/client";

function moodToPrisma(mood: string): PetMood {
  return mood.toUpperCase() as PetMood;
}

export async function createTask(data: {
  title: string;
  urgency: "NOW" | "TODAY" | "MARGIN";
  emotionalType: "SATISFYING" | "NORMAL" | "BORING" | "DRAINING";
  estimatedMinutes?: number | null;
  deadline?: Date | null;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  const order = await taskRepository.getNextOrder(session.user.id);

  await taskRepository.create(session.user.id, {
    title: data.title,
    urgency: data.urgency,
    emotionalType: data.emotionalType,
    estimatedMinutes: data.estimatedMinutes ?? null,
    deadline: data.deadline ?? null,
    order,
  });

  revalidatePath("/tasks");
  revalidatePath("/home");
}

export async function completeTask(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  const task = await taskRepository.findById(id);
  if (!task || task.userId !== session.user.id) throw new Error("Tarea no encontrada");

  await taskRepository.update(id, {
    status: "DONE",
    completedAt: new Date(),
  });

  const coinsEarned = 10;
  const xpEarned = task.urgency === "NOW" ? 30 : task.urgency === "TODAY" ? 20 : 10;

  await gamificationRepository.addCoins(session.user.id, coinsEarned);
  await gamificationRepository.addXp(session.user.id, xpEarned);
  await gamificationRepository.updateDailyProgress(session.user.id, 1);

  const streak = await gamificationRepository.findStreak(session.user.id);
  const today = new Date();
  const lastDate = streak.lastCompletedDate;
  let newCurrent = 1;

  if (lastDate) {
    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0 || diffDays === 1) {
      newCurrent = streak.currentStreak + 1;
    }
  }

  const newLongest = Math.max(streak.longestStreak, newCurrent);
  await gamificationRepository.updateStreak(session.user.id, {
    currentStreak: newCurrent,
    longestStreak: newLongest,
    lastCompletedDate: today,
  });

  let pet = await petRepository.findByUser(session.user.id);
  if (!pet) {
    pet = await petRepository.upsertByUser(session.user.id);
  }
  const gState = await gamificationRepository.findByUser(session.user.id);
  const mood = calculateMood(newCurrent, gState.dailyProgress);
  await petRepository.updateMood(session.user.id, moodToPrisma(mood));

  await gamificationRepository.createRewardLog(
    session.user.id,
    coinsEarned,
    `completed_task:${id}`,
  );

  revalidatePath("/tasks");
  revalidatePath("/home");

  return { coinsEarned, xpEarned };
}

export async function reorderTasks(orderedIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  await taskRepository.reorder(orderedIds);

  revalidatePath("/tasks");
}
