"use client";

import { motion } from "framer-motion";
import { CatLottie } from "@/components/features/CatLottie";

const rows = [
  {
    title: "Añade en segundos",
    desc: "Escribe qué tienes que hacer. Solo el título — nada de campos eternos. Elige urgencia y tipo emocional con un toque.",
    visual: (
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-md ring-1 ring-border/50">
        <div className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm flex items-center text-muted-foreground">
          ¿Qué tienes que hacer?
        </div>
        <div className="flex gap-1.5">
          <span className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-600">Para ya</span>
          <span className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-600">Hoy</span>
          <span className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-600">Margen</span>
        </div>
        <div className="flex gap-1.5">
          <span className="rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">⭐ Satisfactoria</span>
          <span className="rounded-lg bg-muted px-3 py-1.5 text-xs text-muted-foreground">📋 Normal</span>
        </div>
      </div>
    ),
  },
  {
    title: "Ordena con IA",
    desc: "La IA sugiere el mejor orden para tus tareas combinando urgencia, deadline y tipo emocional. Tú puedes arrastrar para ajustarlo.",
    visual: (
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-md ring-1 ring-border/50">
        <div className="flex items-center gap-2 rounded-xl border-l-4 border-rose-400 bg-rose-50/50 px-3 py-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30" />
          <span className="truncate text-sm">Preparar presentación</span>
          <span className="ml-auto rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">Urgente</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border-l-4 border-amber-400 bg-amber-50/50 px-3 py-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30" />
          <span className="truncate text-sm">Responder emails</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border-l-4 border-sky-400 bg-sky-50/50 px-3 py-2">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30" />
          <span className="truncate text-sm">Organizar escritorio</span>
        </div>
      </div>
    ),
  },
  {
    title: "Sin culpa, siempre",
    desc: "El gato nunca se muere ni huye. Como mucho se pone triste si dejas de completar tareas, pero siempre te anima a retomarlo.",
    visual: (
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-amber-100 p-6 shadow-md ring-1 ring-border/50">
        <div className="relative">
          <div className="rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-border/50">
            <p className="text-sm text-muted-foreground">¡Ánimo, un día a la vez! 🐾</p>
          </div>
          <div className="mx-auto h-24 w-28">
            <CatLottie mood="HAPPY" petType="orange-cat" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-xs text-muted-foreground">Feliz</span>
        </div>
      </div>
    ),
  },
  {
    title: "Gamifica sin estrés",
    desc: "Gana monedas y XP al completar tareas. Personaliza a tu gato con accesorios, fondos y efectos. Sin pagos, sin anuncios.",
    visual: (
      <div
        className="flex items-center justify-center rounded-2xl p-6 shadow-md ring-1 ring-border/50"
        style={{
          backgroundImage: "url(/decorations/starry-night.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="h-28 w-32">
          <CatLottie mood="HAPPY" petType="orange-cat" accessories={["hat", "glasses"]} />
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Así de simple funciona
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sin curvas de aprendizaje, sin tutoriales de 10 minutos.
          </p>
        </motion.div>

        <div className="flex flex-col gap-20">
          {rows.map((row, i) => (
            <motion.div
              key={row.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className={`grid items-center gap-8 md:gap-12 ${
                i % 2 === 0
                  ? "md:grid-cols-[1fr_1fr]"
                  : "md:grid-cols-[1fr_1fr]"
              }`}
            >
              {i % 2 === 0 ? (
                <>
                  <div className="max-w-md">
                    <span className="font-heading text-5xl font-bold text-primary/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-heading text-xl font-bold">
                      {row.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {row.desc}
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    {row.visual}
                  </div>
                </>
              ) : (
                <>
                  <div className="order-2 flex justify-center md:order-1 md:justify-start">
                    {row.visual}
                  </div>
                  <div className="order-1 max-w-md md:order-2 md:ml-auto">
                    <span className="font-heading text-5xl font-bold text-primary/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-heading text-xl font-bold">
                      {row.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {row.desc}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
