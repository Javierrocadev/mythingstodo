"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LandingNav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <img src="/nav-cat.svg" alt="" className="h-7 w-auto" />
          <span className="font-heading text-lg font-bold">MyThingsToDo</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#como-funciona"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Cómo funciona
          </a>
          <a
            href="#caracteristicas"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Características
          </a>
          <a
            href="#tienda"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Tienda
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/home"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Usar la app
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
