# MyThingsToDo — Plan de Desarrollo (4 semanas)

> Stack: Next.js 14 (App Router) · TypeScript · Tailwind + shadcn/ui · Prisma + PostgreSQL · NextAuth (Google) · Vercel AI SDK · Framer Motion · Vitest + RTL · Vercel

> Arquitectura: **Capas con Dominio Aislado** (hexagonal ligera) — `lib/core` nunca importa Prisma, NextAuth ni el SDK de IA.

---

## Cómo usar este documento

- [ ] = pendiente, márcalo cuando termines.
- Sigue el orden dentro de cada semana — está pensado para que nunca dependas de algo que aún no existe.
- Cada semana tiene 5 días de trabajo, deja los fines de semana como buffer real, no los cuentes en el plan.

---

## SEMANA 1 — Setup y Fundamentos

### Día 1 — Inicialización del proyecto

- [x] `npx create-next-app@latest` con: TypeScript ✅, Tailwind ✅, App Router ✅, `src/` directory ✅, ESLint ✅
- [x] Configurar `.prettierrc` (semi, singleQuote, tabWidth — lo que ya usas en tus otros proyectos)
- [x] Configurar `.editorconfig` para consistencia entre editores
- [x] Crear repositorio en GitHub
- [x] `git init`, primer commit, push
- [x] Conectar repo a Vercel (deploy automático en cada push a `main`)
- [x] Verificar que el deploy inicial ("Hello Next.js") funciona en producción
- [x] Crear `.env.local` y `.env.example` (con placeholders, nunca con valores reales en el repo)
- [x] Añadir `.env*` a `.gitignore` (verificar que ya está por defecto)

### Día 1-2 — Estructura de carpetas

- [x] Crear estructura completa vacía:
  ```
  src/
  ├── app/
  │   ├── page.tsx                  # NUEVO — Landing, pública, fuera del grupo (dashboard)
  │   ├── login/                    # NUEVO — fuera del grupo (dashboard), no usa AppShell
  │   │   └── page.tsx
  │   ├── onboarding/                # NUEVO — fuera del grupo (dashboard), wizard a pantalla completa
  │   │   └── page.tsx
  │   └── (dashboard)/
  │       ├── home/                  # Pantalla: El Refugio
  │       ├── tasks/                  # Pantalla: El Diario
  │       ├── calendar/               # NUEVO — vista propia, no widget dentro de tasks
  │       ├── shop/                   # Pantalla: Tienda
  │       └── settings/               # NUEVO — mínima, logout
  │
  ├── components/
  │   ├── ui/
  │   └── features/                  # TaskCard, PetWidget, DragList, ProgressBar, CalendarView (nuevo), AppShell (nuevo)...
  │
  ├── lib/
  │   ├── core/                       # sin cambios de fondo, ver nota abajo
  │   ├── actions/
  │   ├── ai/
  │   ├── db/
  │   └── auth/
  │
  ├── hooks/
  └── types/
  ```
- [x] Añadir un `README.md` corto explicando qué va en cada carpeta (te lo agradecerás en la semana 3)
- [x] Configurar alias de imports en `tsconfig.json` (`@/lib/*`, `@/components/*`, etc.) — ya existía `@/*` -> `./src/*`

### Día 2-3 — Tailwind + shadcn/ui + Sistema de color global

- [x] `npx shadcn@latest init` (elegir CSS variables, no clases hardcodeadas)
- [x] Definir paleta "cozy" en `globals.css` como variables CSS:
  - [x] `--background` (tono cálido, nada de gris frío tipo Jira/Trello)
  - [x] `--foreground`
  - [x] `--primary` (color principal/acento del gato)
  - [x] `--accent` (recompensas, racha)
  - [x] `--muted`
  - [x] `--destructive` (úsalo con moderación — recuerda "no generar culpa")
  - [x] `--border`, `--ring`
- [x] Mapear esas variables en `@theme inline` como tokens semánticos (`bg-background`, `text-primary`...) — Tailwind v4 lo hace desde globals.css
- [x] Decidir tipografías: Quicksand (UI/cuerpo) + Fredoka (títulos)
- [ ] Probar el modo claro (decidir si habrá modo oscuro en el MVP o se deja para después)
- [x] Instalar componentes shadcn iniciales: `button`, `card`, `dialog`, `input`, `progress`, `badge`, `sheet`, `calendar`
- [x] Crear una página `/dev/ui-kit` temporal para ver todos los componentes y colores juntos (la borras antes de entregar)

###Día 3-4 — Base de datos

- [x] Crear proyecto en Supabase
- [x] Guardar DATABASE_URL en .env.local
- [x] npx prisma init
- [x] Modelar schema.prisma:
  - [x] User (id, email, name, image, createdAt, onboarding fields, energy/burnout — sistema de burnout interno, ver CONTEXT.md)
  - [x] Task (id, userId, title, urgency enum [NOW/TODAY/MARGIN], emotionalType enum [SATISFYING/NORMAL/BORING/DRAINING], estimatedMinutes, deadline?, status enum [TODO/IN_PROGRESS/DONE/PAUSED], order Int, startedAt?, completedAt?, createdAt)
  - [x] Pet (id, userId, currentMood) — sin currentPetType ni streakDays: el skin activo se deriva de InventoryItem+ShopItem, y la racha vive solo en Streak
  - [x] GamificationState (id, userId, coins, xp, level — único sistema de progreso del proyecto, ya no hay xp/level en Pet, dailyProgress, lastActivityDate)
  - [x] ShopItem (id, name, category enum [pet, animation, decoration, accessory], price, imageUrl, isActive)
  - [x] InventoryItem (id, userId, shopItemId, isEquipped, unlockedAt, equippedAt?) — también es la fuente de verdad de qué mascota/skin está equipado
  - [x] Streak (id, userId, currentStreak, longestStreak, lastCompletedDate) — relación 1:1 con User (singular streak, no streaks[])
  - [x] RewardLog (id, userId, amount, reason, createdAt) — auditoría de recompensas
- [x] Revisar que el modelo soporte el invariante "máx 3 accesorios + 1 mascota equipados" (a nivel de datos, la validación real vive en core/gamification)
- [x] npx prisma migrate dev --name init
- [x] Crear prisma/seed.ts con: 1 usuario de prueba, 3-4 tareas variadas, 2-3 items de tienda, y el gato gratuito por defecto como ShopItem (category=PET, price=0) + su InventoryItem con isEquipped=true (no como campo directo en Pet)
- [x] Ejecutar el seed y verificar en Prisma Studio (npx prisma studio)

Día 5 — Autenticación

- [x] Instalar NextAuth.js + @auth/prisma-adapter
- [x] Configurar proveedor Google OAuth (crear credenciales en Google Cloud Console)
- [x] Crear lib/auth/auth.config.ts
- [x] Configurar callbacks de sesión (incluir userId en la sesión)
- [x] Proxy (proxy.ts) para proteger rutas de (dashboard) — Next.js 16 renombró middleware.ts a proxy.ts
- [x] Pantalla de login simple (logo + botón "Continuar con Google", sin pulir diseño aún)
- [x] Probar login completo end-to-end en local
- [x] Probar login en el entorno de Vercel (variables de entorno de producción configuradas)

SEMANA 2 — Pantallas estáticas + Componentes (con mock data)

Todo esta semana se construye con datos hardcodeados/mock. Cero Server Actions, cero IA todavía. Objetivo: ver y tocar la app.

Día 1-2 — Componentes base reutilizables (components/features)

Ver screens.md y orden-construction.md

SEMANA 3 — Lógica real, Server Actions e IA

Día 1 — Dominio puro (lib/core)

- [x] core/task/task.types.ts — tipos compartidos (Urgency, EmotionalType, TaskStatus)
- [x] core/task/task-score.ts
  - [x] Función pura: scoreTask(task): number combinando urgencia + cercanía de deadline + tipo emocional
  - [x] Función sortTasksByScore(tasks): Task[] — este es el fallback si la IA falla o tarda
  - [ ] Escribir 3-4 tests unitarios ya (se deja para semana 4)
- [x] core/pet/pet-mood.ts
  - [x] Función pura: calculateMood(streak, dailyProgress): "happy" | "neutral" | "sad"
  - [x] Regla explícita: el gato nunca "muere" ni huye, solo varía de mood
- [x] core/gamification/equip-rules.ts
  - [x] Función pura: canEquip(currentEquipped, category): boolean (máx 3 accesorios+decoración, máx 1 mascota/animación)
  - [ ] Tests del invariante (se deja para semana 4)

Día 2 — Server Actions + conexión real a BD

- [x] lib/db/prisma.ts (cliente singleton) — ya existía
- [x] lib/db/task.repository.ts (funciones CRUD simples sobre Task)
- [x] lib/db/pet.repository.ts (incluye resolver el skin/mascota activa consultando InventoryItem+ShopItem con isEquipped=true, no leyendo un campo de Pet)
- [x] lib/db/gamification.repository.ts
- [x] lib/actions/task.actions.ts
  - [x] createTask(data)
  - [x] completeTask(id) → orquesta: marca tarea, actualiza dailyProgress, recalcula streak, recalcula mood del gato
  - [x] reorderTasks(orderedIds) → persiste el campo order
- [x] lib/actions/pet.actions.ts (recalculateMood)
- [x] lib/actions/gamification.actions.ts (equipItem, purchaseItem) — equipItem con category=PET desequipa el PET previo y activa el nuevo
- [x] lib/actions/onboarding.actions.ts — completa onboarding, crea Pet+Streak+defaultSkin
- [x] Sustituir mock data por datos reales en Home, Diario y Tienda (Server Components + await directo a los repositorios)
- [x] Persistir las respuestas del onboarding directamente en los campos ya existentes de User
- [x] revalidatePath/revalidateTag donde corresponda tras cada acción

Día 3 — Micro-interacciones reales

- [x] hooks/useOptimisticTask.ts con useOptimistic para completar tarea al instante (UI cambia antes de que el servidor confirme)
- [x] Conectar confeti/animación de celebración al evento optimista (placeholder de animación, se pule en semana 4)
- [x] hooks/useDragOrder.ts — estado local del reorder + botón "Guardar orden" que llama a reorderTasks
- [ ] Verificar que si el servidor falla, el optimistic update revierte correctamente (se deja para QA manual en Semana 4)

Día 4 — Decisión e integración de IA (parte 1)

- [x] Terminar las pruebas de prompt en playground (Gemini AI Studio / HuggingFace) si no se hizo antes — se omite, usuario decidió Gemini
- [x] Decidir proveedor final: Gemini con gemini-3.5-flash
- [x] Configurar API key en .env.local y en Vercel — usuario confirma que tiene GOOGLE_GENERATIVE_AI_API_KEY
- [x] lib/ai/order-tasks.ts
  - [x] Schema Zod: igual que AI Studio — `{ tasks: [{ id, emotionalType (enum), estimatedMinutes (int) }] }` (no solo IDs, la IA reclasifica emotionalType y estima minutos)
  - [x] System instruction separada del prompt (rol + reglas)
  - [x] Implementar generateObject con el prompt definitivo
  - [x] Manejo de error/timeout → fallback automático a fallbackSort (usa scoreTask internamente)
  - [x] Merge de valores de IA (emotionalType, estimatedMinutes) sobre los datos originales
  - [ ] Test manual pendiente (se prueba al conectar UI en Día 5)

Día 5 — Integración de IA (parte 2) + conexión al flujo

- [ ] Conectar order-tasks.ts al flujo real: tras añadir 3-4 tareas → botón "Ordenar" → llamada a la IA → render del orden sugerido
- [ ] El usuario puede mover con DragList el orden sugerido o dejarlo
- [ ] Al pulsar "Guardar", persistir tareas + orden final (sea de la IA o modificado)
- [ ] lib/ai/pet-messages.ts — frases motivacionales generadas (no crítico, puede variar)
- [ ] Conectar frases del gato al globo de texto en Home (reemplazar el texto hardcodeado)

SEMANA 4 — Animaciones, Testing, Pulido y Deploy

Día 1-2 — Framer Motion

- [ ] Transición de mood del gato (feliz ↔ neutral ↔ triste) suave, sin saltos brutos
- [ ] Animación de idle del gato (respiración/parpadeo sutil, nada que distraiga)
- [ ] Celebración real al completar tarea (confeti ligero + reacción del gato) — nada de animaciones infinitas o sobrecargadas (recordar alerta UX del brief)
- [ ] Transición de entrada/salida del NewTaskForm (Sheet/Dialog)
- [ ] Transiciones entre pantallas del dashboard (sutiles)
- [ ] Animación del ProgressBar al subir el % (no instantáneo, que se sienta el avance)

Día 3 — Testing

- [ ] Vitest config (vitest.config.ts) + setup de RTL
- [ ] Tests de lib/core/\* (ya escritos parcialmente en semana 3, completar cobertura):
  - [ ] task-score.ts — casos límite (sin deadline, deadline hoy, todas urgentes)
  - [ ] pet-mood.ts — todas las combinaciones streak/progreso
  - [ ] equip-rules.ts — límites exactos (2→3 ok, 3→4 falla)
- [ ] Tests de componentes con RTL:
  - [ ] TaskCard dispara onComplete correctamente
  - [ ] NewTaskForm no permite guardar sin título, no acepta texto libre fuera de él
  - [ ] DragList reordena y refleja el nuevo orden en el DOM
- [ ] Tests de Server Actions sensibles (reorderTasks, completeTask) si da tiempo — al menos los casos felices

Día 4 — QA manual contra el brief original

- [ ] Repasar "Alertas UX" del documento: ¿algo se siente estética SaaS/corporativa? ¿colores fríos tipo Jira en algún sitio?
- [ ] ¿Hay algún mensaje o mecánica que genere culpa? (el gato nunca debe regañar)
- [ ] ¿Hay campos obligatorios de más en el formulario de tarea? (debe seguir siendo <5s crear una)
- [ ] ¿Hay sobreestimulación? (banners, tiendas demasiado recargadas, animaciones que no paran)
- [ ] Revisión responsive completa (full-width web, adaptable a móvil y desktop)
- [ ] Probar el flujo completo de un usuario nuevo de principio a fin (login → onboarding → crear tareas → ordenar con IA → completar → ver recompensa → tienda)

Día 5 — Deploy final

- [ ] Revisar todas las variables de entorno en Vercel (DB, NextAuth, API key del proveedor de IA, NEXTAUTH_URL de producción)
- [ ] Probar login en producción (Google OAuth con el dominio real configurado en Google Cloud Console)
- [ ] Revisar logs de Vercel buscando errores silenciosos
- [ ] Borrar páginas/rutas de desarrollo (/dev/ui-kit, etc.)
- [ ] Lighthouse rápido (performance/accesibilidad básica)
- [ ] Buffer para lo que haya quedado a medias de días anteriores

Notas y decisiones pendientes a lo largo del proyecto

- [ ] Proveedor de IA definitivo: ⬜ Gemini ⬜ HuggingFace ⬜ otro
- [ ] ¿Modo oscuro en el MVP?: ⬜ Sí ⬜ No, futuro
- [ ] ¿Notificaciones push en esta versión web?: ⬜ No (confirmado — se deja para móvil)
- [ ] ¿Sistema de anuncios para monedas extra en el MVP?: ⬜ Sí ⬜ Placeholder sin lógica real
- [ ] Sistema de burnout (energy/burnout en User): confirmado que se mantiene, pero es interno — no se muestra como métrica/barra visible al usuario en ninguna pantalla del MVP (ver CONTEXT.md)

### Por hacer antes de continuar (guest/anonymous mode)

- [ ] Resolver cómo se guardan las tareas creadas en modo invitado (almacenamiento local / sesión anónima) y cómo se "adoptan" a la cuenta real al hacer login — detalle completo en `screens.md`, sección 7
- [ ] Decidir si el MVP incluirá modo invitado o solo login con Google (actualmente proxy.ts es un no-op, no protege rutas)

### Decisiones registradas en CONTEXT.md (Semana 3 Día 2)

- [x] Patrón Server Component (reads) → Client Component + useTransition + Server Actions (writes)
- [x] Rewards de completeTask: 10 coins + XP por urgencia
- [x] Onboarding: Server Action crea Pet + Streak + defaultSkin en una transacción
- [x] ShopView usa canEquip de lib/core, no duplica lógica
- [x] Orquestación completa de completeTask documentada
