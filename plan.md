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
  │   └── (dashboard)/
  │       ├── home/
  │       ├── tasks/
  │       └── shop/
  ├── components/
  │   ├── ui/
  │   └── features/
  ├── lib/
  │   ├── core/
  │   │   ├── task/
  │   │   ├── pet/
  │   │   └── gamification/
  │   ├── actions/
  │   ├── ai/
  │   ├── db/
  │   └── auth/
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

- [ ] Instalar NextAuth.js + @auth/prisma-adapter
- [ ] Configurar proveedor Google OAuth (crear credenciales en Google Cloud Console)
- [ ] Crear lib/auth/auth.config.ts
- [ ] Configurar callbacks de sesión (incluir userId en la sesión)
- [ ] Middleware (middleware.ts) para proteger rutas de (dashboard)
- [ ] Pantalla de login simple (logo + botón "Continuar con Google", sin pulir diseño aún)
- [ ] Probar login completo end-to-end en local
- [ ] Probar login en el entorno de Vercel (variables de entorno de producción configuradas)

SEMANA 2 — Pantallas estáticas + Componentes (con mock data)

Todo esta semana se construye con datos hardcodeados/mock. Cero Server Actions, cero IA todavía. Objetivo: ver y tocar la app.

Día 1-2 — Componentes base reutilizables (components/features)

- [ ] TaskCard
  - [ ] Estado normal / urgente / completada (visual diferenciado)
  - [ ] Indicador de tipo emocional (satisfactoria/normal/aburrida)
  - [ ] Slide visual de estado si no hay subtareas
  - [ ] Checkbox/gesto de completar (sin lógica real aún, solo callback onComplete)
- [ ] ProgressBar (barra de progreso diario con %, con marcador de próxima recompensa)
- [ ] StreakIndicator (icono de fuego/huella + número de días)
- [ ] PetWidget
  - [ ] 3 estados visuales: feliz / neutral / triste (estático, sin animación todavía)
  - [ ] Globo de texto motivacional encima
- [ ] FloatingAddButton (botón "+" fijo, abre Sheet/Dialog de nueva tarea)
- [ ] NewTaskForm
  - [ ] Input de título (único campo de texto libre)
  - [ ] Botones predefinidos de urgencia: Para ya / Hoy / Margen
  - [ ] Botones predefinidos de tipo emocional: Satisfactoria / Normal / Aburrida / Agotadora
  - [ ] Toggle opcional: ¿añadir al calendario? (deadline)
  - [ ] Input opcional: tiempo estimado
- [ ] DragList
  - [ ] Instalar @dnd-kit/core + @dnd-kit/sortable
  - [ ] Integrar con mock data, verificar reorder visual fluido
- [ ] CoinCounter (contador de monedas, esquina superior derecha)

Día 3 — Pantalla 1: El Refugio (Home)

- [ ] Layout general de la pantalla
- [ ] PetWidget centrado con mood mock
- [ ] Globo de texto motivacional (frases hardcodeadas por ahora, ej. "¡Una tarea más y hay premio!")
- [ ] Tarjeta de "Tu tarea activa" (única tarea destacada — la primera del mock)
- [ ] Navegación inferior/lateral hacia Diario y Tienda

Día 4 — Pantalla 2: El Diario (Tareas)

- [ ] ProgressBar diario en la parte superior
- [ ] StreakIndicator junto a la barra
- [ ] Listado de tareas con DragList (mock data, 5-6 tareas variadas)
- [ ] Resaltado visual de la tarea recomendada (la primera del orden)
- [ ] FloatingAddButton + NewTaskForm funcionando con mock (push local al array, sin persistir)
- [ ] Calendario simple con deadlines de las tareas que lo tengan (componente calendar de shadcn)

Día 5 — Pantalla 3: Tienda + Onboarding

- [ ] Tabs/secciones por categoría: Mascotas / Animaciones / Decoración / Accesorios
- [ ] Grid de items mock por categoría con precio
- [ ] Lógica visual de "equipar" (estado local, sin persistir): resaltar el equipado, bloquear selección si ya hay 3 accesorios o 1 mascota activos
- [ ] CoinCounter con botón "conseguir más" (placeholder, sin lógica de anuncios aún)
- [ ] Wizard de onboarding (4 pasos):
  - [ ] Paso 1: ¿Trabajo / Vida cotidiana / Ambos?
  - [ ] Paso 2: ¿Cuánto tiempo quieres dedicar a ser productivo al día?
  - [ ] Paso 3: ¿Qué tipo de notificaciones quieres?
  - [ ] Paso 4: ¿Te interesa un modo "focus"?
- [ ] Guardar respuestas en estado local (persistencia real en semana 3)

SEMANA 3 — Lógica real, Server Actions e IA

Día 1 — Dominio puro (lib/core)

- [ ] core/task/task.types.ts — tipos compartidos (Urgency, EmotionalType, TaskStatus)
- [ ] core/task/task-score.ts
  - [ ] Función pura: scoreTask(task): number combinando urgencia + cercanía de deadline + tipo emocional
  - [ ] Función sortTasksByScore(tasks): Task[] — este es el fallback si la IA falla o tarda
  - [ ] Escribir 3-4 tests unitarios ya (es gratis, es función pura)
- [ ] core/pet/pet-mood.ts
  - [ ] Función pura: calculateMood(streak, dailyProgress): "happy" | "neutral" | "sad"
  - [ ] Regla explícita: el gato nunca "muere" ni huye, solo varía de mood
- [ ] core/gamification/equip-rules.ts
  - [ ] Función pura: canEquip(currentEquipped, category): boolean (máx 3 accesorios+decoración, máx 1 mascota/animación)
  - [ ] Tests del invariante (intentar equipar un 4º accesorio debe fallar)

Día 2 — Server Actions + conexión real a BD

- [ ] lib/db/prisma.ts (cliente singleton)
- [ ] lib/db/task.repository.ts (funciones CRUD simples sobre Task)
- [ ] lib/db/pet.repository.ts (incluye resolver el skin/mascota activa consultando InventoryItem+ShopItem con isEquipped=true, no leyendo un campo de Pet)
- [ ] lib/db/gamification.repository.ts
- [ ] lib/actions/task.actions.ts
  - [ ] createTask(data)
  - [ ] completeTask(id) → orquesta: marca tarea, actualiza dailyProgress, recalcula streak, recalcula mood del gato
  - [ ] reorderTasks(orderedIds) → persiste el campo order
- [ ] lib/actions/pet.actions.ts
- [ ] lib/actions/gamification.actions.ts (equipItem, addCoins) — equipItem con category=PET simplemente activa/desactiva isEquipped en InventoryItem, no toca Pet
- [ ] Sustituir mock data por datos reales en Home, Diario y Tienda (Server Components + await directo a los repositorios)
- [ ] Persistir las respuestas del onboarding directamente en los campos ya existentes de User (onboardingWorkType, onboardingDailyTime, onboardingFocusMode, notificationsEnabled, onboardingCompleted) — no se necesita una tabla UserPreferences nueva, ya están en el schema
- [ ] revalidatePath/revalidateTag donde corresponda tras cada acción

Día 3 — Micro-interacciones reales

- [ ] hooks/useOptimisticTask.ts con useOptimistic para completar tarea al instante (UI cambia antes de que el servidor confirme)
- [ ] Conectar confeti/animación de celebración al evento optimista (placeholder de animación, se pule en semana 4)
- [ ] hooks/useDragOrder.ts — estado local del reorder + botón "Guardar orden" que llama a reorderTasks
- [ ] Verificar que si el servidor falla, el optimistic update revierte correctamente (probar desconectando red a propósito)

Día 4 — Decisión e integración de IA (parte 1)

- [ ] Terminar las pruebas de prompt en playground (Gemini AI Studio / HuggingFace) si no se hizo antes
- [ ] Decidir proveedor final
- [ ] Configurar API key en .env.local y en Vercel
- [ ] lib/ai/order-tasks.ts
  - [ ] Definir schema Zod: z.object({ order: z.array(z.string()) })
  - [ ] Implementar generateObject con el prompt definitivo
  - [ ] Manejo de error/timeout → fallback automático a sortTasksByScore
  - [ ] Test manual: ¿el orden tiene sentido con casos reales?

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
- [ ] Revisión responsive completa (móvil primero, ya que el uso real es de sesiones cortas y frecuentes)
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
