type Mood = "HAPPY" | "NEUTRAL" | "SAD";

const messages: Record<Mood, string[]> = {
  HAPPY: [
    "¡Una tarea más y hay premio!",
    "Vas como un cohete 🚀",
    "Me encanta verte en acción",
    "¡Racha imparable!",
    "Hoy estás imparable",
    "Cada tarea completada es un pasito más",
    "¡Qué bien lo estás haciendo!",
    "Sigue así, que esto se nota",
  ],
  NEUTRAL: [
    "Estoy aquí para ayudarte 🐾",
    "Cada pequeña tarea cuenta",
    "Tú puedes con todo",
    "Vamos paso a paso",
    "Un día a la vez",
    "No hace falta hacerlo todo hoy",
    "Respira, tú puedes",
    "Poquito a poco se llega lejos",
  ],
  SAD: [
    "Siempre puedes empezar de nuevo",
    "Hoy no ha salido, pero mañana será otro día",
    "No pasa nada, aquí estoy",
    "Descansa y vuelve cuando quieras",
    "Lo importante es intentarlo",
    "Siempre hay un mañana para intentarlo de nuevo",
    "No pasa nada por tener un día tranquilo",
  ],
};

export function getPetMessage(mood: Mood): string {
  const pool = messages[mood];
  return pool[Math.floor(Math.random() * pool.length)];
}
