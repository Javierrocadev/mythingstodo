import Link from "next/link";
import { LandingCat } from "@/components/features/LandingCat";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <img src="/nav-cat.svg" alt="" className="h-8 w-auto" />
          <span className="font-heading text-lg font-bold">MyThingsToDo</span>
        </div>
        <Link
          href="/login"
          className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          Iniciar sesión
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 text-center">
        <LandingCat />

        <div className="max-w-sm space-y-3">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Tus cosas, tu gato,{' '}
            <span className="text-primary">sin culpa</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Organiza tus tareas con una mascota virtual que te acompaña, no te
            juzga. Simple, rápida y sin estrés.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/home"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-3 font-medium shadow-sm transition-colors"
          >
            Usar la app
          </Link>
          <p className="text-muted-foreground text-xs">
            Sin registro · Tus tareas se guardan en el navegador
          </p>
        </div>
      </main>
    </div>
  );
}
