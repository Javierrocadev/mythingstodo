"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CtaBanner() {
  return (
    <section className="px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 p-8 ring-1 ring-border/50 md:flex-row md:p-12"
      >
        <div className="max-w-md space-y-2 text-center md:text-left">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            ¿Preparado para organizar tu día?
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sin presión, sin culpa, con un gato que siempre estará ahí.
          </p>
        </div>
        <Link
          href="/home"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Usar la app ahora
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
      </motion.div>
    </section>
  );
}
