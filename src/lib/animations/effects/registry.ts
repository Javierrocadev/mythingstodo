import confettiData from "@/lib/animations/effects/confetti.json";
import celebrationData from "@/lib/animations/effects/celebration.json";

export const effectRegistry: Record<string, object> = {
  confetti: confettiData,
  celebration: celebrationData,
};

export function getEffect(name: string): object | undefined {
  return effectRegistry[name];
}
