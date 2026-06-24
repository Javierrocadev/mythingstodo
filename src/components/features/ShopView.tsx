"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PetWidget } from "./PetWidget";

type Category = "PET" | "ANIMATION" | "DECORATION" | "ACCESSORY";

interface ShopItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  imageUrl: string;
  petType?: string;
}

const allItems: ShopItem[] = [
  { id: "p1", name: "Gato Naranja", category: "PET", price: 0, imageUrl: "/pets/orange-cat/happy.svg", petType: "orange-cat" },
  { id: "p2", name: "Gato Atigrado", category: "PET", price: 150, imageUrl: "/pets/tabby-cat/happy.svg", petType: "tabby-cat" },
  { id: "p3", name: "Gato Negro", category: "PET", price: 200, imageUrl: "/pets/black-cat/happy.svg", petType: "black-cat" },
  { id: "p4", name: "Gato Blanco", category: "PET", price: 250, imageUrl: "/pets/white-cat/happy.svg", petType: "white-cat" },
  { id: "a1", name: "Sombrero de Chef", category: "ACCESSORY", price: 100, imageUrl: "/accessories/chef-hat.svg" },
  { id: "a2", name: "Gafas de Sol", category: "ACCESSORY", price: 75, imageUrl: "/accessories/sunglasses.svg" },
  { id: "a3", name: "Pajarita", category: "ACCESSORY", price: 120, imageUrl: "/accessories/bowtie.svg" },
  { id: "d1", name: "Fondo de Bosque", category: "DECORATION", price: 200, imageUrl: "/decorations/forest-bg.svg" },
  { id: "d2", name: "Fondo Estelar", category: "DECORATION", price: 250, imageUrl: "/decorations/stars-bg.svg" },
  { id: "m1", name: "Estela Brillante", category: "ANIMATION", price: 300, imageUrl: "/animations/sparkle-trail.svg" },
  { id: "m2", name: "Aura de Corazones", category: "ANIMATION", price: 350, imageUrl: "/animations/hearts-aura.svg" },
];

const categoryTabs: { key: Category; label: string }[] = [
  { key: "PET", label: "Mascotas" },
  { key: "ANIMATION", label: "Animaciones" },
  { key: "DECORATION", label: "Decoración" },
  { key: "ACCESSORY", label: "Accesorios" },
];

export function ShopView() {
  const [activeTab, setActiveTab] = useState<Category>("PET");
  const [equipped, setEquipped] = useState<Set<string>>(new Set(["p1"]));
  const [selectedPet, setSelectedPet] = useState("orange-cat");

  const filteredItems = useMemo(
    () => allItems.filter((item) => item.category === activeTab),
    [activeTab],
  );

  const equipCounts = useMemo(() => {
    let accessoriesAndDecor = 0;
    let pets = 0;
    let animations = 0;
    for (const id of equipped) {
      const item = allItems.find((i) => i.id === id);
      if (!item) continue;
      if (item.category === "ACCESSORY" || item.category === "DECORATION") accessoriesAndDecor++;
      if (item.category === "PET") pets++;
      if (item.category === "ANIMATION") animations++;
    }
    return { accessoriesAndDecor, pets, animations };
  }, [equipped]);

  const canEquip = (item: ShopItem): boolean => {
    if (equipped.has(item.id)) return true;
    if (item.category === "PET") return equipCounts.pets < 1;
    if (item.category === "ANIMATION") return equipCounts.animations < 1;
    return equipCounts.accessoriesAndDecor < 3;
  };

  const handleToggle = (item: ShopItem) => {
    if (equipped.has(item.id)) {
      setEquipped((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      if (item.petType) {
        const remainingPets = allItems.filter(
          (i) => i.category === "PET" && equipped.has(i.id) && i.id !== item.id,
        );
        if (remainingPets.length === 0) {
          setSelectedPet("orange-cat");
        } else {
          const firstRemaining = remainingPets[0];
          setSelectedPet(firstRemaining.petType ?? "orange-cat");
        }
      }
      return;
    }

    if (!canEquip(item)) {
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

    // If equipping a pet, unequip the current one
    if (item.category === "PET") {
      setEquipped((prev) => {
        const next = new Set(prev);
        for (const id of next) {
          const existing = allItems.find((i) => i.id === id);
          if (existing?.category === "PET") next.delete(id);
        }
        next.add(item.id);
        return next;
      });
      setSelectedPet(item.petType ?? "orange-cat");
    } else {
      setEquipped((prev) => new Set(prev).add(item.id));
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4">
      <PetWidget mood="HAPPY" size="compact" petType={selectedPet} />

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
          const isEquipped = equipped.has(item.id);
          const canEquipItem = canEquip(item);

          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item)}
              disabled={!isEquipped && !canEquipItem}
              className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                isEquipped
                  ? "border-primary bg-primary/5 shadow-sm"
                  : canEquipItem
                    ? "border-border bg-background hover:border-muted-foreground/30"
                    : "border-border/50 cursor-not-allowed opacity-50"
              }`}
            >
              {isEquipped && (
                <span className="bg-primary text-primary-foreground absolute right-2 top-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                  ✓
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
