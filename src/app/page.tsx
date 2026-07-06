import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { PetShowcase } from "@/components/landing/PetShowcase";
import { CtaBanner } from "@/components/landing/CtaBanner";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LandingNav />

      <main>
        <LandingHero />
        <HowItWorks />
        <FeaturesGrid />
        <PetShowcase />
        <CtaBanner />
      </main>

      <footer className="border-t border-border px-4 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/nav-cat.svg" alt="" className="h-6 w-auto" />
            <span className="font-heading text-sm font-bold">MyThingsToDo</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Hecho con 💛 para quienes tienen mucho que hacer
          </p>
          <Link
            href="/login"
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Iniciar sesión
          </Link>
        </div>
      </footer>
    </div>
  );
}
