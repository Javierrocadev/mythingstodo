import hatData from "@/lib/animations/accessories/hat.json";
import hatGreenData from "@/lib/animations/accessories/hat-green.json";
import glassesData from "@/lib/animations/accessories/glasses.json";

export const accessoryRegistry: Record<string, object> = {
  hat: hatData,
  "hat-green": hatGreenData,
  glasses: glassesData,
};

export function getAccessory(name: string): object | undefined {
  return accessoryRegistry[name];
}
