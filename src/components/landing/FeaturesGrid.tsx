"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "⚡",
    title: "Rápido",
    desc: "Un solo campo de texto y botones predefinidos. Creas una tarea en menos de 5 segundos.",
  },
  {
    icon: "🧘",
    title: "Sin culpa",
    desc: "El gato nunca se muere ni huye. Como mucho se pone triste, pero siempre te recibe.",
  },
  {
    icon: "🎮",
    title: "Jugable",
    desc: "Monedas, XP, racha y una tienda para personalizar a tu gato. Sin estrés, solo diversión.",
  },
  {
    icon: "🪙",
    title: "Gratis",
    desc: "Sin suscripciones, sin trials, sin anuncios. Es gratis siempre, punto.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function FeaturesGrid() {
  return (
    <section id="caracteristicas" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Hecho para ti, no para tu jefe
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Olvídate de las apps de productividad que parecen hojas de cálculo.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              className="group rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/50 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 font-heading text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
