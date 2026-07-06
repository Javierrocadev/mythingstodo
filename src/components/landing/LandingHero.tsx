"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CatLottie } from "@/components/features/CatLottie";

function FloatingCard({
  className,
  rotate,
  children,
  delay = 0,
}: {
  className?: string;
  rotate?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={`absolute hidden rounded-2xl bg-white shadow-lg ring-1 ring-border/50 md:block ${rotate ?? ""} ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

export function LandingHero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-60px)] items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent" />

      <FloatingCard
        className="left-[3%] top-[18%] w-52 lg:left-[8%]"
        rotate="-rotate-3"
        delay={0.2}
      >
        <div className="flex flex-col gap-1.5 p-3">
          <div className="flex items-center gap-2 rounded-lg border-l-[3px] border-rose-400 bg-rose-50/50 px-2.5 py-1.5">
            <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
            <span className="truncate text-xs font-medium">Preparar reunión</span>
            <span className="ml-auto rounded-full bg-rose-100 px-1 py-0.5 text-[9px] font-bold text-rose-600">Urgente</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border-l-[3px] border-amber-400 bg-amber-50/50 px-2.5 py-1.5">
            <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-400 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-2 w-2">
                <path d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" />
              </svg>
            </div>
            <span className="truncate text-xs text-muted-foreground line-through">Responder emails</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border-l-[3px] border-sky-400 bg-sky-50/50 px-2.5 py-1.5">
            <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-muted-foreground/30" />
            <span className="truncate text-xs font-medium">Organizar docs</span>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        className="-right-2 top-[12%] w-44 lg:right-[6%]"
        rotate="rotate-2"
        delay={0.4}
      >
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-amber-100 p-4">
          <div className="relative">
            <div className="rounded-xl bg-white px-3 py-1.5 shadow-sm ring-1 ring-border/50">
              <p className="text-xs text-muted-foreground">¡Vamos allá! 🐾</p>
            </div>
            <div className="h-20 w-24">
              <CatLottie mood="HAPPY" petType="orange-cat" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] text-muted-foreground">Feliz</span>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        className="bottom-[18%] left-[5%] w-56 lg:left-[10%]"
        rotate="-rotate-1"
        delay={0.6}
      >
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>3/5 tareas</span>
            <span className="font-heading text-sm font-bold text-amber-600">60%</span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted shadow-inner">
            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-orange-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-[10px] text-red-400">● 1</span>
            <span className="flex items-center gap-0.5 text-[10px] text-amber-500">● 1</span>
            <span className="flex items-center gap-0.5 text-[10px] text-sky-400">● 0</span>
            <span className="ml-auto">🐱</span>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard
        className="bottom-[22%] right-[3%] w-36 lg:right-[8%]"
        rotate="rotate-3"
        delay={0.8}
      >
        <div className="flex flex-col gap-2 p-3">
          <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-border p-2">
            <span className="text-lg">🎀</span>
            <span className="text-[10px] font-medium">Sombrero</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] text-amber-700">🪙 Gratis</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-border p-2 opacity-60">
            <span className="text-lg">🌲</span>
            <span className="text-[10px] font-medium">Fondo</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] text-amber-700">🪙 150</span>
          </div>
        </div>
      </FloatingCard>

      <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="h-48 w-56">
            <CatLottie mood="HAPPY" petType="orange-cat" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
        >
          Tus cosas, tu gato,{" "}
          <span className="text-primary">sin culpa</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          Organiza tus tareas con una mascota virtual que te acompaña, no te
          juzga. Simple, rápida y sin estrés.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Usar la app
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="#como-funciona"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Más información
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          Sin registro · Tus tareas se guardan en el navegador
        </motion.p>
      </div>
    </section>
  );
}
