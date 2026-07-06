"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CatLottie } from "@/components/features/CatLottie";

const items = [
  { id: "orange-cat", category: "pet" as const, name: "Gato Naranja" },
  { id: "black-cat", category: "pet" as const, name: "Gato Negro" },
  { id: "hat", category: "accessory" as const, name: "Sombrero" },
  { id: "glasses", category: "accessory" as const, name: "Gafas" },
  { id: "/decorations/forest-bg.svg", category: "decoration" as const, name: "Fondo Bosque" },
  {
    id: "/decorations/starry-night.svg",
    category: "decoration" as const,
    name: "Noche Estrellada",
  },
];

export function PetShowcase() {
  const [petType, setPetType] = useState("orange-cat");
  const [equippedAccs, setEquippedAccs] = useState<string[]>([]);
  const [decoration, setDecoration] = useState<string | null>(null);

  const handleClick = (item: (typeof items)[number]) => {
    if (item.category === "pet") {
      setPetType(item.id);
    } else if (item.category === "accessory") {
      setEquippedAccs((prev) =>
        prev.includes(item.id) ? prev.filter((a) => a !== item.id) : [...prev, item.id],
      );
    } else if (item.category === "decoration") {
      setDecoration((prev) => (prev === item.id ? null : item.id));
    }
  };

  const isActive = (item: (typeof items)[number]) => {
    if (item.category === "pet") return petType === item.id;
    if (item.category === "accessory") return equippedAccs.includes(item.id);
    if (item.category === "decoration") return decoration === item.id;
    return false;
  };

  return (
    <section id="tienda" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Personaliza a tu compañero
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cambia su aspecto, accesorios y fondo — todo se consigue jugando.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid items-start gap-8 md:grid-cols-2 md:gap-12"
        >
          <div className="flex justify-center items-center h-full md:top-28">
            <div
              className="relative flex h-64 w-72 items-center justify-center rounded-2xl shadow-inner"
              style={
                decoration
                  ? {
                      backgroundImage: `url(${decoration})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : { backgroundColor: "var(--amber-100, #fef3c7)" }
              }
            >
              <CatLottie mood="HAPPY" petType={petType} accessories={equippedAccs} />
            </div>
          </div>

          <div>
            <p className="font-heading text-lg font-bold">Mezcla y combina</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Haz clic en cada elemento para verlo en vivo.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((item) => {
                const active = isActive(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4  text-center transition-all ${
                      active
                        ? "ring-2 ring-primary bg-primary/5"
                        : "ring-1 ring-border/50 bg-card hover:ring-primary/30"
                    }`}
                  >
                    <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg">
                      {item.category === "decoration" && (
                        <div
                          className="absolute inset-0 rounded-lg"
                          style={{
                            backgroundImage: `url(${item.id})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                      )}
                      <div className="relative h-24 w-24">
                        {item.category === "accessory" ? (
                          <CatLottie mood="HAPPY" petType={petType} accessories={[item.id]} className="h-full w-full" />
                        ) : item.category === "decoration" ? (
                          <CatLottie mood="HAPPY" petType={petType} className="h-full w-full" />
                        ) : (
                          <CatLottie mood="HAPPY" petType={item.id} className="h-full w-full" />
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-medium">{item.name}</span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {active ? "Equipado" : "Seleccionar"}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* 
            {equippedAccs.length > 0 && (
              <p className="mt-4 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                💡 Los accesorios se acumulan — haz clic de nuevo para quitarlos
              </p>
            )}
              */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
