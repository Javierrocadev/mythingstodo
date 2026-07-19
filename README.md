# MyThingsToDo 🐱 (MVP)

**Tus cosas, tu gato, sin culpa.**

MyThingsToDo es un **MVP (Producto Mínimo Viable)** de gestión de tareas con una mascota virtual (un gato) y gamificación suave, diseñado para personas con sobrecarga mental, procrastinación o que abandonan apps de productividad por ser demasiado complejas.

Tres palabras definen cada decisión del producto: **simple, rápida, sin culpa**.

---

## Stack tecnológico

| Categoría          | Tecnología                                              |
| ------------------ | ------------------------------------------------------- |
| Framework          | Next.js 16 (App Router)                                 |
| Lenguaje           | TypeScript                                              |
| Estilos            | Tailwind CSS v4 + CSS variables semánticas (shadcn/ui)  |
| Componentes        | shadcn/ui + Radix UI                                    |
| Animaciones        | Framer Motion + Lottie                                  |
| Base de datos      | PostgreSQL (Supabase)                                   |
| ORM                | Prisma                                                  |
| Autenticación      | NextAuth.js v5 (Google OAuth)                           |
| IA                 | Vercel AI SDK + Google Gemini (ordenación de tareas)    |
| Drag & Drop        | @dnd-kit                                                |
| Fechas             | date-fns                                                |
| Iconos             | HugeIcons                                               |
| Testing            | Vitest                                                  |
| Despliegue         | Vercel                                                  |
| Notificaciones     | Sonner (toasts)                                         |

---

## Funcionalidades principales

### 📝 Gestión de tareas ("El Diario")
- Creación de tareas en segundos: solo un campo de texto libre (título).
- Urgencia predefinida: **NOW** / **TODAY** / **MARGIN** (botones, no texto libre).
- Tipo emocional: **SATISFYING** / **NORMAL** / **BORING** / **DRAINING**.
- Estados: TODO → IN_PROGRESS → DONE → PAUSED.
- Drag & drop para reordenar prioridad.

### 🤖 Ordenación inteligente con IA
- Al añadir 3-4 tareas, un botón "Ordenar" invoca a Google Gemini.
- La IA reclasifica tipo emocional y estima minutos.
- Si falla o da timeout, cae automáticamente a un algoritmo heurístico determinista (sin que el usuario lo note).

### 🐱 Mascota virtual ("El Refugio")
- Gato animado con Lottie que cambia de estado: **feliz** / **neutral** / **triste**.
- El gato **nunca muere ni huye**. Como mucho se pone triste.
- Frases motivacionales contextuales según su estado de ánimo.
- Reacciona a eventos: completar tareas, subir de nivel, cambiar equipamiento.

### 🎮 Gamificación sin estrés
- Monedas y XP por completar tareas (10 coins base + XP variable por urgencia).
- Rachas diarias (streak) que motivan sin castigar.
- Sistema de niveles y recompensas por hitos (cada 50 tareas completadas).
- Sin barras de burnout visibles, sin métricas de fracaso, sin culpa.

### 🛒 Tienda
- 4 categorías: Mascotas, Animaciones, Decoración, Accesorios.
- Máximo 3 accesorios + 1 mascota + 1 animación equipados simultáneamente.
- Skin gratuito por defecto asignado al completar el onboarding.

### 📅 Calendario
- Vista propia con drag para reagendar tareas arrastrándolas entre días.

### 🏠 Landing page
- Hero con el gato como protagonista, secciones explicativas y showcase interactivo de la tienda.

### 👤 Modo invitado
- La app funciona sin login. Las tareas en modo invitado se migran a la cuenta al autenticarse.

---

## Arquitectura: Capas con Dominio Aislado (hexagonal ligera)

El proyecto usa una versión ligera de **arquitectura hexagonal**. El principio fundamental es que el dominio puro (`lib/core/`) **NUNCA** conoce la infraestructura (base de datos, autenticación, IA, HTTP).

```
┌──────────────────────────────────────────────────┐
│                   app/ (UI)                       │
│  Server Component → lee datos → pinta pantalla    │
│  Client Component → useTransition → Server Action │
└──────────────────────┬───────────────────────────┘
                       │ llama
┌──────────────────────▼───────────────────────────┐
│              lib/actions/ (orquestación)          │
│  Recibe datos → llama a core/ → llama a db/      │
└───────┬────────────────────────────┬─────────────┘
        │                            │
┌───────▼────────┐         ┌────────▼────────────┐
│   lib/core/     │         │    lib/db/           │
│   (dominio)     │         │    (infraestructura) │
│                 │         │                      │
│  Funciones      │         │  Prisma +            │
│  puras, sin     │         │  repositorios        │
│  imports de     │         │                      │
│  infraestructura│         │                      │
└─────────────────┘         └─────────────────────┘
```

### Estructura del proyecto

```
src/
├── app/                              # 🖥️ Páginas y layouts
│   ├── page.tsx                        # Landing (pública)
│   ├── layout.tsx                      # Layout raíz
│   ├── login/                          # Google OAuth
│   ├── onboarding/                     # Wizard 4 pasos
│   └── (dashboard)/                    # Grupo protegido
│       ├── home/                       # "El Refugio"
│       ├── tasks/                      # "El Diario"
│       ├── calendar/                   # Vista calendario
│       ├── shop/                       # Tienda
│       └── settings/                   # Ajustes + stats
│
├── components/
│   ├── ui/                             # shadcn/ui (sin lógica de negocio)
│   └── features/                       # Componentes del negocio
│       ├── AppShell.tsx                # Nav inferior + CoinCounter
│       ├── PetWidget.tsx / CatLottie.tsx
│       ├── TaskCard.tsx / DragList.tsx
│       ├── NewTaskForm.tsx
│       ├── ProgressBar.tsx / StreakIndicator.tsx
│       ├── ShopView.tsx / CalendarView.tsx
│       ├── CoinCounter.tsx / DailyEarningsCounter.tsx
│       ├── RewardToast.tsx / EffectOverlay.tsx
│       ├── EmptyState.tsx / FloatingAddButton.tsx
│       └── TrophyMilestones.tsx / WeeklyEarningsBars.tsx
│
├── lib/
│   ├── core/                           # 🧠 DOMINIO PURO
│   │   ├── task/                       # task-score.ts, task.types.ts
│   │   ├── pet/                        # pet-mood.ts
│   │   └── gamification/               # equip-rules.ts
│   │
│   ├── actions/                        # 🔌 Server Actions
│   │   ├── task.actions.ts
│   │   ├── pet.actions.ts
│   │   ├── gamification.actions.ts
│   │   └── onboarding.actions.ts
│   │
│   ├── ai/                             # 🤖 Vercel AI SDK
│   │   ├── order-tasks.ts
│   │   └── pet-messages.ts
│   │
│   ├── db/                             # 🗄️ Prisma + repositorios
│   │   ├── prisma.ts                   # Cliente singleton
│   │   ├── task.repository.ts
│   │   ├── pet.repository.ts
│   │   ├── gamification.repository.ts
│   │   └── stats.repository.ts
│   │
│   └── auth/                           # 🔐 NextAuth
│       └── auth.config.ts
│
├── hooks/                              # useOptimisticTask, useDragOrder
├── types/                              # Tipos compartidos entre capas
├── proxy.ts                            # Middleware Next.js 16
└── globals.css                         # Tokens de color globales

prisma/
├── schema.prisma                       # Modelo de datos
└── seed.ts                             # Datos de prueba
```

### Flujo de llamadas

```
app/ (Server Component)
  └─► lib/actions/ (Server Action)
        ├─► lib/core/ (lógica de negocio, función pura)
        └─► lib/db/ (persistencia, Prisma)
        └─► respuesta a la UI
```

### Reglas que no se negocian

1. **`lib/core/`** NO puede importar Prisma, NextAuth, `next/headers`, el SDK de IA ni nada que toque red, DB o filesystem. Si necesita datos, se los pasan como parámetros desde `lib/actions/`.
2. Las Server Actions orquestan: reciben la request, llaman a `core/` para validar/calcular, llaman a `db/` para persistir, devuelven la respuesta.
3. Los Server Components leen datos directamente desde `lib/db/` y se los pasan como props a Client Components.
4. Los Client Components usan `useTransition` + Server Actions para mutaciones. Nada de `useEffect` para leer datos.

---

## Instalación y ejecución

### Requisitos

- Node.js 20+
- PostgreSQL (o cuenta en Supabase/Neon)
- Cuenta en Google Cloud Console (para OAuth)
- API key de Google Gemini (opcional, la app funciona sin IA con fallback)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/anomalycod3/mythingstodo.git
cd mythingstodo

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno y configurarlas
cp .env.example .env.local
```

Editar `.env.local` con tus valores:

```env
# Base de datos (PostgreSQL en Supabase/Neon)
DATABASE_URL="postgresql://..."

# Autenticación (Google OAuth)
AUTH_SECRET="..."                          # npx auth secret
AUTH_GOOGLE_ID="..."                       # Google Cloud Console → OAuth → Client ID
AUTH_GOOGLE_SECRET="..."                   # Google Cloud Console → OAuth → Client Secret
AUTH_URL="http://localhost:3000"

# IA (Vercel AI SDK + Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="..."

# URL base para NextAuth en producción
NEXTAUTH_URL="http://localhost:3000"
```

```bash
# 4. Inicializar base de datos
npx prisma migrate dev --name init

# 5. Cargar datos de prueba
npm run prisma:seed
# o: npx tsx prisma/seed.ts

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Comandos disponibles

| Comando              | Descripción                           |
| -------------------- | ------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                |
| `npm run build`      | Build de producción                   |
| `npm run start`      | Iniciar servidor de producción        |
| `npm run lint`       | ESLint                                |
| `npm test`           | Ejecutar tests (Vitest)               |
| `npm run test:watch` | Tests en modo watch                   |
| `npx prisma studio`  | Explorar base de datos                |
| `npx prisma migrate` | Gestionar migraciones                 |

---

## Testing

El proyecto usa **Vitest**. Los tests cubren principalmente el dominio puro en `lib/core/`:

```bash
npm test
```

Tests incluidos:
- **task-score**: 11 tests (scoreTask con/sin deadline, tipos emocionales, ordenación heurística)
- **pet-mood**: 6 tests (combinaciones de racha y progreso diario)
- **equip-rules**: 7 tests (límites exactos de equipamiento)

---

## Cómo se construyó (el proceso detrás del MVP)

El proyecto se desarrolló en **6 semanas** siguiendo un plan incremental. Cada semana construye sobre la anterior:

| Semana | Qué se hizo                                                                                  |
| ------ | -------------------------------------------------------------------------------------------- |
| **1**  | Setup del proyecto, estructura de carpetas, Tailwind + shadcn/ui, modelo de datos (Prisma + PostgreSQL), autenticación con Google OAuth |
| **2**  | Componentes visuales con datos mock (PetWidget, TaskCard, DragList, AppShell, ShopView, etc.) — todo el frontend sin backend real |
| **3**  | Lógica de dominio puro (`lib/core/`), Server Actions conectadas a BD real, integración con IA (Gemini para ordenar tareas), micro-interacciones con `useOptimistic` |
| **4**  | Animaciones Framer Motion + Lottie (gato, confeti, transiciones), tests unitarios del dominio (Vitest), pulido visual |
| **5**  | Landing page completa con showcase interactivo del gato y la tienda |
| **6**  | Estadísticas numéricas en ajustes (sin gráficos, solo datos) |

### Filosofía de construcción

1. **Mock primero, real después** — Semana 2 se construyó todo con datos hardcodeados para poder ver y tocar la app antes de escribir una sola Server Action.
2. **Dominio antes que infraestructura** — Las funciones puras de `lib/core/` (task-score, pet-mood, equip-rules) se escribieron y testearon antes de tocar Prisma.
3. **Fallback siempre** — Si la IA falla, el orden de tareas se resuelve con un algoritmo determinista. El usuario nunca ve un error.
4. **Sin deuda técnica consentida** — El modo invitado y la migración de datos anónimos quedaron pendientes (ver `screens.md` sección 7), pero todo lo demás está conectado contra BD real.

---

## Principios de diseño

- **Sin culpa**: el gato nunca regaña, no hay métricas de fracaso visibles, no hay castigos.
- **Cero fricción**: crear una tarea toma menos de 5 segundos. Un solo campo de texto libre.
- **Sesiones cortas**: diseñado para entrar, ver la tarea sugerida, completarla y salir.
- **Cozy, no corporativo**: estética cálida, nada de paletas frías tipo Jira/Trello.
- **Mobile-first responsive**: full-width, adaptable a cualquier tamaño de pantalla.

---

## Licencia

MIT
