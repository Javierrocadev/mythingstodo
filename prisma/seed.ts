import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const items = [
    { name: "Gato Naranja", category: "PET" as const, price: 0, imageUrl: "/pets/orange-cat/happy.svg" },
    { name: "Gato Negro", category: "PET" as const, price: 50, imageUrl: "/pets/black-cat/happy.svg" },
    { name: "Sombrero", category: "ACCESSORY" as const, price: 0, imageUrl: "/accessories/hat.json" },
    { name: "Sombrero Verde", category: "ACCESSORY" as const, price: 50, imageUrl: "/accessories/hat-green.json" },
    { name: "Gafas", category: "ACCESSORY" as const, price: 75, imageUrl: "/accessories/glasses.json" },
    { name: "Fondo de Bosque", category: "DECORATION" as const, price: 0, imageUrl: "/decorations/forest-bg.svg" },
    { name: "Clásico", category: "DECORATION" as const, price: 0, imageUrl: "" },
    { name: "Puntos Cálidos", category: "DECORATION" as const, price: 150, imageUrl: "/decorations/cozy-dots.svg" },
    { name: "Noche Estrellada", category: "DECORATION" as const, price: 150, imageUrl: "/decorations/starry-night.svg" },
    { name: "Confeti", category: "ANIMATION" as const, price: 0, imageUrl: "/animations/confetti.json" },
    { name: "Celebración", category: "ANIMATION" as const, price: 100, imageUrl: "/animations/celebration.json" },
  ];

  for (const item of items) {
    const exists = await prisma.shopItem.findFirst({
      where: { name: item.name, category: item.category },
    });
    if (exists) {
      await prisma.shopItem.update({
        where: { id: exists.id },
        data: { price: item.price, imageUrl: item.imageUrl, isActive: true },
      });
      console.log(`  Updated: ${item.name} -> ${item.price} coins`);
    } else {
      await prisma.shopItem.create({ data: { ...item, isActive: true } });
      console.log(`  Added: ${item.name}`);
    }
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
