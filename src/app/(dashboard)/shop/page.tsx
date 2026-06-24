import { auth } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/db/prisma";
import { gamificationRepository } from "@/lib/db/gamification.repository";
import { petRepository } from "@/lib/db/pet.repository";
import { ShopView } from "@/components/features/ShopView";

export default async function ShopPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [shopItems, inventory, gState, pet, activeSkin] = await Promise.all([
    prisma.shopItem.findMany({ where: { isActive: true }, orderBy: { price: "asc" } }),
    prisma.inventoryItem.findMany({
      where: { userId: session.user.id },
      include: { shopItem: true },
    }),
    gamificationRepository.findByUser(session.user.id),
    petRepository.findByUser(session.user.id),
    petRepository.findActiveSkin(session.user.id),
  ]);

  return (
    <ShopView
      items={shopItems.map((i) => ({
        id: i.id,
        name: i.name,
        category: i.category as "PET" | "ANIMATION" | "DECORATION" | "ACCESSORY",
        price: i.price,
        imageUrl: i.imageUrl,
        petType: i.category === "PET" ? i.imageUrl.split("/")[2] : undefined,
      }))}
      ownedIds={new Set(inventory.map((inv) => inv.shopItemId))}
      equippedIds={new Set(inventory.filter((inv) => inv.isEquipped).map((inv) => inv.shopItemId))}
      coins={gState.coins}
      petMood={(pet?.currentMood ?? "NEUTRAL") as "HAPPY" | "NEUTRAL" | "SAD"}
      selectedPetType={activeSkin?.shopItem.imageUrl?.split("/")[2] ?? "orange-cat"}
    />
  );
}
