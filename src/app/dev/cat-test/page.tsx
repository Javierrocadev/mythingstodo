"use client";

import { useState } from "react";
import { CatLottie } from "@/components/features/CatLottie";

const moods = ["HAPPY", "NEUTRAL", "SAD"] as const;
const catTypes = ["orange-cat", "black-cat"] as const;
const accessoryOptions = ["hat", "hat-green", "glasses"] as const;

export default function CatTestPage() {
  const [selected, setSelected] = useState<string>("orange-cat");
  const [activeAcc, setActiveAcc] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col items-center gap-12 py-12">
      <h1 className="font-heading text-2xl font-semibold">🧪 Cat variants + Accesorios</h1>

      <div className="flex flex-wrap gap-3">
        {catTypes.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              selected === t
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveAcc(null)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            activeAcc === null
              ? "bg-muted-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Sin accesorio
        </button>
        {accessoryOptions.map((acc) => (
          <button
            key={acc}
            onClick={() => setActiveAcc(activeAcc === acc ? null : acc)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeAcc === acc
                ? "bg-muted-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {acc}
          </button>
        ))}
      </div>

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {moods.map((mood) => (
          <div key={mood} className="flex flex-col items-center gap-3">
            <h2 className="font-heading text-base font-semibold">{mood}</h2>
            <div className="flex h-56 w-60 items-center justify-center rounded-2xl bg-amber-50 shadow-inner">
              <CatLottie
                mood={mood}
                petType={selected}
                accessories={activeAcc ? [activeAcc] : []}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
