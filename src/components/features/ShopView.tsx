"use client";

import { useState, useMemo, useTransition } from "react";
import { toast } from "sonner";
import { PetWidget } from "./PetWidget";
import { CatLottie } from "./CatLottie";
import { EffectOverlay } from "./EffectOverlay";
import { equipItem, purchaseItem, unequipAllAccessories } from "@/lib/actions/gamification.actions";
import { canEquip } from "@/lib/core/gamification/equip-rules";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShopItemData {
  id: string;
  name: string;
  category: "PET" | "ANIMATION" | "DECORATION" | "ACCESSORY";
  price: number;
  imageUrl: string;
  petType?: string;
}

interface ShopViewProps {
  items: ShopItemData[];
  ownedIds: Set<string>;
  equippedIds: Set<string>;
  equippedAccessories: string[];
  equippedDecoration: string | null;
  equippedAnimation: string;
  coins: number;
  petMood: "HAPPY" | "NEUTRAL" | "SAD";
  selectedPetType: string;
}

const categoryTabs: { key: ShopItemData["category"]; label: string }[] = [
  { key: "PET", label: "Mascotas" },
  { key: "ACCESSORY", label: "Accesorios" },
  { key: "DECORATION", label: "Decoración" },
  { key: "ANIMATION", label: "Animaciones" },
];

const categoryIcons: Record<string, string> = {
  PET: "🐱",
  ACCESSORY: "🎀",
  DECORATION: "🌿",
  ANIMATION: "✨",
};

export function ShopView({
  items,
  ownedIds,
  equippedIds: initialEquippedIds,
  equippedAccessories,
  equippedDecoration,
  equippedAnimation,
  coins,
  petMood,
  selectedPetType: initialPetType,
}: ShopViewProps) {
  const [activeTab, setActiveTab] = useState<ShopItemData["category"]>("PET");
  const [equippedIds, setEquippedIds] = useState(initialEquippedIds);
  const [selectedPetType, setSelectedPetType] = useState(initialPetType);
  const [, startTransition] = useTransition();
  const [pendingPurchase, setPendingPurchase] = useState<ShopItemData | null>(null);

  const filteredItems = useMemo(
    () => items.filter((item) => item.category === activeTab),
    [items, activeTab],
  );

  const currentEquipped = useMemo(
    () =>
      items
        .filter((item) => equippedIds.has(item.id))
        .map((item) => ({ category: item.category })),
    [items, equippedIds],
  );

  const handleToggle = (item: ShopItemData) => {
    const isEquipped = equippedIds.has(item.id);

    if (isEquipped) {
      setEquippedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      if (item.petType) {
        const remainingPet = items.find(
          (i) => i.category === "PET" && equippedIds.has(i.id) && i.id !== item.id,
        );
        if (!remainingPet) {
          setSelectedPetType("orange-cat");
        } else {
          setSelectedPetType(remainingPet.petType ?? "orange-cat");
        }
      }
    } else if (!ownedIds.has(item.id)) {
      setPendingPurchase(item);
      return;
    } else if (item.category === "PET") {
      setEquippedIds((prev) => {
        const next = new Set(prev);
        for (const id of next) {
          const existing = items.find((i) => i.id === id);
          if (existing?.category === "PET") next.delete(id);
        }
        next.add(item.id);
        return next;
      });
      setSelectedPetType(item.petType ?? "orange-cat");
    } else if (item.category === "DECORATION") {
      setEquippedIds((prev) => {
        const next = new Set(prev);
        for (const id of next) {
          const existing = items.find((i) => i.id === id);
          if (existing?.category === "DECORATION") next.delete(id);
        }
        next.add(item.id);
        return next;
      });
    } else {
      if (!canEquip(currentEquipped, item.category)) {
        if (item.category === "ANIMATION") {
          toast("Ya tienes una animación equipada", {
            description: "Desequipa la actual antes de elegir otra",
          });
        } else {
          toast("Límite alcanzado", {
            description: "Máximo 3 entre accesorios y decoración",
          });
        }
        return;
      }
      setEquippedIds((prev) => new Set(prev).add(item.id));
    }

    startTransition(() => {
      equipItem(item.id);
    });
  };

  const handleConfirmPurchase = () => {
    if (!pendingPurchase) return;
    const item = pendingPurchase;
    setPendingPurchase(null);
    startTransition(async () => {
      try {
        await purchaseItem(item.id);
        await equipItem(item.id);
        setEquippedIds((prev) => {
          const next = new Set(prev);
          if (item.category === "PET" || item.category === "DECORATION") {
            for (const id of next) {
              const existing = items.find((i) => i.id === id);
              if (existing?.category === item.category) next.delete(id);
            }
          }
          next.add(item.id);
          return next;
        });
        if (item.petType) setSelectedPetType(item.petType);
        toast(`¡${item.name} equipado!`);
      } catch {
        toast("Monedas insuficientes", { description: "Sigue completando tareas" });
      }
    });
  };

  const handleClearAccessories = () => {
    setEquippedIds((prev) => {
      const next = new Set(prev);
      for (const id of next) {
        const item = items.find((i) => i.id === id);
        if (item?.category === "ACCESSORY") next.delete(id);
      }
      return next;
    });

    startTransition(() => {
      unequipAllAccessories();
    });
  };

  return (
    <>
      <Dialog open={!!pendingPurchase} onOpenChange={(open) => { if (!open) setPendingPurchase(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Comprar {pendingPurchase?.name}?</DialogTitle>
          </DialogHeader>
          {pendingPurchase && (
            <div className="flex flex-col items-center gap-4">
              <div
                className="flex h-40 w-full items-center justify-center rounded-xl"
                style={pendingPurchase.category === "DECORATION" && pendingPurchase.imageUrl
                  ? { backgroundImage: `url(${pendingPurchase.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { backgroundColor: "hsl(var(--muted) / 0.3)" }}
              >
                {(() => {
                  const p = pendingPurchase;
                  const accName = p.category === "ACCESSORY"
                    ? p.imageUrl.split("/")[2]?.replace(".json", "")
                    : undefined;
                  const effName = p.category === "ANIMATION"
                    ? p.imageUrl.split("/")[2]?.replace(".json", "")
                    : undefined;
                  return p.category === "PET" && p.petType ? (
                    <CatLottie mood="NEUTRAL" petType={p.petType} className="h-32 w-auto" />
                  ) : p.category === "ACCESSORY" && accName ? (
                    <CatLottie mood="NEUTRAL" petType={selectedPetType} accessories={[accName]} className="h-32 w-auto" />
                  ) : p.category === "DECORATION" ? (
                    <CatLottie mood="NEUTRAL" petType={selectedPetType} className="h-32 w-auto" />
                  ) : p.category === "ANIMATION" && effName ? (
                    <div className="relative">
                      <CatLottie mood="NEUTRAL" petType={selectedPetType} className="h-32 w-auto" />
                      <EffectOverlay effect={effName} preview />
                    </div>
                  ) : (
                    <img src={p.imageUrl} alt={p.name} className="h-32 w-auto object-contain" />
                  );
                })()}
              </div>
              <DialogDescription className="text-center">
                <span className="flex items-center justify-center gap-1.5 text-lg font-semibold text-amber-800">
                  🪙 {pendingPurchase.price}
                </span>
              </DialogDescription>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingPurchase(null)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmPurchase}>
              Confirmar compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col items-center gap-3">
        <PetWidget mood={petMood} petType={selectedPetType} accessories={equippedAccessories} decoration={equippedDecoration ?? undefined} effect={equippedAnimation} />
        <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
          🪙 {coins}
        </span>
      </div>

      <nav className="flex gap-1.5 rounded-2xl bg-muted/50 p-1.5">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{categoryIcons[tab.key]}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {activeTab === "ACCESSORY" && (
          <button
            type="button"
            onClick={handleClearAccessories}
            className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all ${
              equippedAccessories.length === 0
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
            }`}
          >
            {equippedAccessories.length === 0 && (
              <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground shadow-sm">
                ✓
              </span>
            )}
            <div className="flex h-48 w-full items-center justify-center rounded-xl">
              <CatLottie mood="NEUTRAL" petType={selectedPetType} className="h-44 w-auto" />
            </div>
            <span className="text-sm font-medium leading-tight">Ninguno</span>
            <div className="mt-auto flex w-full flex-col items-center gap-1.5">
              <span className="text-muted-foreground text-xs">—</span>
              {equippedAccessories.length === 0 ? (
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-medium text-primary">
                  Seleccionado
                </span>
              ) : (
                <span className="rounded-full bg-muted px-3 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  Quitar todos
                </span>
              )}
            </div>
          </button>
        )}
        {filteredItems.map((item) => {
          const isOwned = ownedIds.has(item.id);
          const isEquipped = equippedIds.has(item.id);
          const accName = item.category === "ACCESSORY"
            ? item.imageUrl.split("/")[2]?.replace(".json", "")
            : undefined;
          const effName = item.category === "ANIMATION"
            ? item.imageUrl.split("/")[2]?.replace(".json", "")
            : undefined;

  return (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              disabled={!isOwned && coins < item.price}
              className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition-all ${
                isEquipped
                  ? "border-primary bg-primary/5"
                  : isOwned
                    ? "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
                    : coins >= item.price
                      ? "border-dashed border-primary/40 bg-background hover:border-primary/60 hover:bg-primary/5"
                      : "border-dashed border-border/60 opacity-50"
              }`}
            >
              {isEquipped && (
                <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground shadow-sm">
                  ✓
                </span>
              )}

              {!isOwned && (
                <span className="absolute left-2.5 top-2.5 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  NUEVO
                </span>
              )}

              <div
                className="flex h-48 w-full items-center justify-center rounded-xl"
                style={item.category === "DECORATION" && item.imageUrl ? { backgroundImage: `url(${item.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              >
                {item.category === "PET" && item.petType ? (
                  <CatLottie mood="NEUTRAL" petType={item.petType} className="h-44 w-auto" />
                ) : item.category === "ACCESSORY" && accName ? (
                  <CatLottie mood="NEUTRAL" petType={selectedPetType} accessories={[accName]} className="h-44 w-auto" />
                ) : item.category === "DECORATION" ? (
                  <CatLottie mood="NEUTRAL" petType={selectedPetType} className="h-44 w-auto" />
                ) : item.category === "ANIMATION" && effName ? (
                  <div className="relative">
                    <CatLottie mood="NEUTRAL" petType={selectedPetType} className="h-44 w-auto" />
                    <EffectOverlay effect={effName} preview />
                  </div>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-44 w-auto object-contain"
                  />
                )}
              </div>

              <span className="text-sm font-medium leading-tight">{item.name}</span>

              <div className="mt-auto flex w-full flex-col items-center gap-1.5">
                <span className="text-muted-foreground text-xs">🪙 {item.price}</span>
                {isEquipped ? (
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-medium text-primary">
                    Equipado
                  </span>
                ) : isOwned ? (
                  <span className="rounded-full bg-muted px-3 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    Equipar
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-medium text-amber-700">
                    Comprar
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12">
          <span className="text-3xl">📭</span>
          <p className="text-muted-foreground text-sm">No hay items en esta categoría</p>
        </div>
      )}
    </div>
    </>)
}
