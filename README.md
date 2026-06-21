# MyThingsToDo

Gestión de tareas con mascota virtual (gato) y gamificación. Simple, rápida, sin culpa.

## Estructura del proyecto

```
src/
├── app/
│   └── (dashboard)/         # Rutas protegidas de la app
│       ├── home/             # El Refugio (gato + tarea activa)
│       ├── tasks/            # El Diario (lista de tareas)
│       └── shop/             # Tienda (ítems para el gato)
├── components/
│   ├── ui/                   # shadcn/ui (sin lógica de negocio)
│   └── features/             # TaskCard, PetWidget, DragList...
├── lib/
│   ├── core/                 # 🧠 Dominio puro — funciones puras
│   │   ├── task/             # task-score, tipos
│   │   ├── pet/              # pet-mood
│   │   └── gamification/     # equip-rules
│   ├── actions/              # 🔌 Server Actions
│   ├── ai/                   # Servicios de IA
│   ├── db/                   # Prisma y repositorios
│   └── auth/                 # NextAuth
├── hooks/                    # Custom hooks
└── types/                    # Tipos compartidos
```

## Stack

Next.js 14 · TypeScript · Tailwind + shadcn/ui · Prisma + PostgreSQL · NextAuth (Google) · Vercel AI SDK · Framer Motion

## Desarrollo

```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build de producción
npm run lint    # ESLint
```
