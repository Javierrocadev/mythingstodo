"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth.config";
import { petRepository } from "@/lib/db/pet.repository";
import { gamificationRepository } from "@/lib/db/gamification.repository";
import { calculateMood } from "@/lib/core/pet/pet-mood";
import type { PetMood } from "@prisma/client";

function moodToPrisma(mood: string): PetMood {
  return mood.toUpperCase() as PetMood;
}

export async function recalculateMood() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("No autenticado");

  let pet = await petRepository.findByUser(session.user.id);
  if (!pet) {
    pet = await petRepository.upsertByUser(session.user.id);
  }

  const streak = await gamificationRepository.findStreak(session.user.id);
  const gState = await gamificationRepository.findByUser(session.user.id);

  const mood = calculateMood(streak.currentStreak, gState.dailyProgress);
  await petRepository.updateMood(session.user.id, moodToPrisma(mood));

  revalidatePath("/home");
  revalidatePath("/tasks");
}
