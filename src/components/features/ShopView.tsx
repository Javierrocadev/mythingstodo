"use client";

import { useState, useMemo, useTransition } from "react";
import { toast } from "sonner";
import { PetWidget } from "./PetWidget";
import { equipItem, purchaseItem } from "@/lib/actions/gamification.actions";
import { canEquip } from "@/lib/core/gamification/equip-rules";

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
  coins: number;
  petMood: "HAPPY" | "NEUTRAL" | "SAD";
  selectedPetType: string;
}

const categoryTabs: { key: ShopItemData["category"]; label: string }[] = [
  { key: "PET", label: "Mascotas" },
  { key: "ANIMATION", label: "Animaciones" },
  { key: "DECORATION", label: "Decoración" },
  { key: "ACCESSORY", label: "Accesorios" },
];

export function ShopView({
  items,
  ownedIds,
  equippedIds: initialEquippedIds,
  coins,
  petMood,
  selectedPetType: initialPetType,
}: ShopViewProps) {
  const [activeTab, setActiveTab] = useState<ShopItemData["category"]>("PET");
  const [equippedIds, setEquippedIds] = useState(initialEquippedIds);
  const [selectedPetType, setSelectedPetType] = useState(initialPetType);
  const [, startTransition] = useTransition();

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
      startTransition(async () => {
        try {
          await purchaseItem(item.id);
          toast(`¡${item.name} adquirido!`, { description: "Ahora puedes equiparlo" });
        } catch (e) {
          toast((e as Error).message, { description: "No tienes suficientes monedas" });
        }
      });
      return;
    } else {
      if (!canEquip(currentEquipped, item.category)) {
        if (item.category === "PET") {
          toast("Ya tienes una mascota equipada", {
            description: "Desequipa la actual antes de elegir otra",
          });
        } else if (item.category === "ANIMATION") {
          toast("Ya tienes una animación equipada", {
            description: "Desequipa la actual antes de elegir otra",
          });
        } else {
          toast("Límite de accesorios alcanzado", {
            description: "Máximo 3 entre accesorios y decoración",
          });
        }
        return;
      }

      if (item.category === "PET") {
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
      } else {
        setEquippedIds((prev) => new Set(prev).add(item.id));
      }
    }

    startTransition(() => {
      equipItem(item.id);
    });
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <PetWidget mood={petMood} size="compact" petType={selectedPetType} />
        <span className="text-sm font-medium">🪙 {coins}</span>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filteredItems.map((item) => {
          const isOwned = ownedIds.has(item.id);
          const isEquipped = equippedIds.has(item.id);
          const canEquipItem = canEquip(currentEquipped, item.category);

          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              disabled={!isOwned && coins < item.price}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                isEquipped
                  ? "border-primary bg-primary/5 shadow-sm"
                  : isOwned
                    ? "border-border bg-background hover:border-muted-foreground/30"
                    : "border-border/50 cursor-not-allowed opacity-50"
              }`}
            >
              {isEquipped && (
                <span className="bg-primary text-primary-foreground absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                  ✓
                </span>
              )}

              {!isOwned && (
                <span className="absolute left-2 top-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                  NUEVO
                </span>
              )}

              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-16 w-auto"
              />
              <span className="text-xs font-medium">{item.name}</span>
              <span className="text-muted-foreground text-xs">
                🪙 {item.price}
              </span>
              {!isOwned && (
                <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium">
                  Comprar
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-sm">
          No hay items en esta categoría
        </p>
      )}
    </div>
  );
}
