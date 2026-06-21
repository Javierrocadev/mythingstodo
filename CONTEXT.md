# CONTEXT.md — MyThingsToDo

> Este archivo es la fuente de verdad para cualquier IA (Claude Code, OpenCode, Cursor, etc.) que trabaje en este repo. Léelo antes de proponer código, librerías o cambios de estructura. Si una sugerencia tuya contradice algo de aquí, está mal — vuelve a leer este archivo, no improvises.
>
> El plan de tareas semana a semana está en `plan.md`. Este archivo no dice _qué_ hacer hoy, dice _cómo_ debe hacerse siempre.

---

## 1. Qué es este producto (resumen para no perder el rumbo)

MyThingsToDo (alias interno "CatFocus") es una app de gestión de tareas con **mascota virtual (gato)** y gamificación, dirigida a gente con sobrecarga mental, procrastinación o que abandona apps de productividad por ser demasiado complejas.

Tres palabras que definen toda decisión de producto: **simple, rápida, sin culpa**.

- El gato **nunca muere ni huye**. Como mucho se pone triste/neutral. La penalización es perder la racha, nunca destruir progreso.
- Cero fricción de escritura: el único campo de texto libre en una tarea es el título. Todo lo demás son botones predefinidos.
- Nada de estética SaaS/corporativa (sin gráficos de pastel serios, sin paletas frías tipo Jira/Trello).
- Sesiones de uso cortas y frecuentes (entrar, ver la tarea sugerida, salir) — no diseñes para sesiones largas.

Si dudas si una feature "pega" con el producto, pregúntate: ¿esto añade culpa, fricción o ruido visual? Si sí, no.

---

## 2. Stack (cerrado, no proponer alternativas sin que se pida explícitamente)

```ts
{
  framework: "Next.js 14 (App Router)",
  lenguaje: "TypeScript",
  estilos: "Tailwind CSS + tokens semánticos vía CSS variables (shadcn). CSS Modules SOLO para sprites/animaciones del gato",
  componentes: "shadcn/ui",
  animaciones: "Framer Motion",
  base_datos: "PostgreSQL (Supabase o Neon)",
  ORM: "Prisma",
  autenticacion: "NextAuth.js (Google OAuth)",
  IA: "Vercel AI SDK + generateObject (Zod) — proveedor: Gemini o HuggingFace (ver plan.md)",
  estado_cliente: "useState + useOptimistic (nativos de React/Next)",
  testing: "Vitest + React Testing Library",
  despliegue: "Vercel"
}
```

**Explícitamente descartado — no lo sugieras:**

- ❌ Zustand / Redux / Jotai / cualquier librería de estado global de cliente
- ❌ TanStack Query / React Query / SWR
- ❌ `app/api/` para CRUD interno (usar Server Actions). `app/api/` solo se justifica para webhooks externos reales
- ❌ Cualquier ORM que no sea Prisma
- ❌ CSS-in-JS (styled-components, emotion...)

---

## 3. Arquitectura: "Capas con Dominio Aislado"

Versión ligera de arquitectura hexagonal. **La única regla que no se negocia**: `lib/core/**` no importa NADA de infraestructura. Ni Prisma, ni NextAuth, ni el SDK de IA, ni `next/headers`, ni nada que toque red, DB o filesystem.

```
src/
├── app/
│   └── (dashboard)/
│       ├── home/        # Pantalla 1: El Refugio
│       ├── tasks/        # Pantalla 2: El Diario
│       └── shop/         # Pantalla 3: Tienda
│
├── components/
│   ├── ui/                # shadcn, sin lógica de negocio
│   └── features/          # TaskCard, PetWidget, DragList, ProgressBar...
│
├── lib/
│   ├── core/               # 🧠 DOMINIO — funciones puras, testeables sin mocks
│   │   ├── task/
│   │   │   ├── task.types.ts
│   │   │   └── task-score.ts      # heurística — fallback si la IA falla
│   │   ├── pet/
│   │   │   └── pet-mood.ts
│   │   └── gamification/
│   │       └── equip-rules.ts     # invariante 3+1
│   │
│   ├── actions/             # 🔌 Server Actions — orquestan core + db + ai
│   │   ├── task.actions.ts
│   │   ├── pet.actions.ts
│   │   └── gamification.actions.ts
│   │
│   ├── ai/                  # servicios de IA (no determinista, no crítico)
│   │   ├── order-tasks.ts
│   │   └── pet-messages.ts
│   │
│   ├── db/                  # 🗄️ Prisma y repositorios
│   └── auth/                # 🔐 NextAuth
│
├── hooks/
└── types/
```

### Ejemplo de import permitido vs prohibido

```ts
// ✅ PERMITIDO — lib/actions/task.actions.ts
import { sortTasksByScore } from "@/lib/core/task/task-score";
import { taskRepository } from "@/lib/db/task.repository";

// ❌ PROHIBIDO — lib/core/task/task-score.ts
import { prisma } from "@/lib/db/prisma"; // el dominio NUNCA conoce la infra
import { auth } from "@/lib/auth/auth.config"; // tampoco
```

Si necesitas que `core` use datos de la DB, pásalos como **parámetros** a la función pura desde `lib/actions/`. El dominio recibe datos, no los va a buscar.

### Quién llama a quién

`app/` (Server Component) → `lib/actions/` (Server Action) → orquesta `lib/core/` + `lib/db/` + `lib/ai/` → responde a la UI.

No hay capa de "casos de uso" formal ni interfaces de repositorio con adaptador — para el plazo de 1 mes es ceremonia de más. Si el proyecto crece después del MVP, eso se sube de nivel entonces, no antes.

---

## 4. Invariantes de dominio (reglas de negocio que SIEMPRE deben cumplirse)

Estas reglas viven en `lib/core/` y deben respetarse desde cualquier punto de entrada (UI, Server Action, seed, test). Nunca confiar solo en la validación de la base de datos.

1. **Equipamiento (`equip-rules.ts`)**: máximo 3 ítems equipados simultáneamente en categorías Accesorios + Decoración combinadas, y máximo 1 en Mascotas y máximo 1 en Animaciones.
2. **Orden de tareas (`task-score.ts`)**: si la llamada a la IA de ordenación falla, da timeout, o devuelve un JSON que no pasa la validación de Zod, se cae automáticamente a esta heurística determinista (urgencia + cercanía de deadline + tipo emocional). El usuario nunca debe notar el fallback ni ver un error.
3. **Mood del gato (`pet-mood.ts`)**: solo 3 estados (feliz/neutral/triste). Nunca un estado de "muerto" o "abandonado". La pérdida de racha resetea el contador de días, pero nunca borra el inventario ni el progreso histórico.
4. **Formulario de tarea**: el título es el único campo de texto libre. Urgencia (NOW/TODAY/MARGIN) y tipo emocional (SATISFYING/NORMAL/BORING/DRAINING) son siempre selección de botón predefinido, nunca un select libre ni un input. Los estados de tarea disponibles son TODO/IN_PROGRESS/DONE/PAUSED.
5. **Mascota/skin activo**: `Pet` solo almacena `currentMood`. El skin o mascota equipada se resuelve SIEMPRE consultando `InventoryItem` (categoría PET/ANIMATION) con `isEquipped=true`, unido a `ShopItem`. Nunca añadir un campo de tipo de mascota directamente en `Pet` — eso crea una segunda fuente de verdad que se desincroniza con la tienda.

---

## 5. Convenciones de nombres y código

- Archivos de dominio puro: `kebab-case.ts` (`task-score.ts`, `pet-mood.ts`)
- Componentes: `PascalCase.tsx`
- Server Actions: siempre con sufijo `.actions.ts`, y cada función exportada con verbo claro (`createTask`, `completeTask`, no `taskHandler`)
- Tipos compartidos entre capas van en `types/`, no duplicados dentro de `lib/core` y `lib/db`
- Toda función en `lib/core/` debe ser pura: mismos inputs → mismos outputs, sin `Date.now()` ni `Math.random()` directo dentro (si necesitas la fecha actual, pásala como parámetro desde fuera, así es testeable)
- Validación de datos que cruzan el límite IA → app: siempre con Zod, nunca confiar en el JSON crudo de un LLM

---

## 6. Decisiones ya tomadas (no las reabras sin que el usuario lo pida)

| Tema                | Decisión                                                                                                                                                           | Por qué                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Estado global       | Ninguna librería, `useState`/`useOptimistic`                                                                                                                       | No hay necesidad real de caché compleja en el MVP                                                             |
| Reordenar tareas    | IA decide el orden inicial, usuario puede arrastrar para ajustar, se persiste al guardar                                                                           | Valida la encuesta: 74.3% prefiere híbrido/automático sobre manual puro                                       |
| Estructura          | Hexagonal ligera, sin puertos/adaptadores formales                                                                                                                 | Plazo de 1 mes, no es necesario el rigor completo                                                             |
| Notificaciones/push | Fuera de esta versión web                                                                                                                                          | Se reservan para la versión móvil                                                                             |
| Auth                | Solo Google OAuth vía NextAuth                                                                                                                                     | Suficiente para MVP, sin fricción de registro                                                                 |
| Progreso/XP         | Un solo sistema de progreso, vive en `GamificationState` (coins, xp, level). `Pet` no tiene xp/level propio                                                        | Evitar dos sistemas de progresión paralelos que se puedan desincronizar                                       |
| Sistema de burnout  | Se mantiene (`energy`/`burnout` en `User`), pero es **interno**: modula tono de mensajes del gato, nunca se muestra como barra/métrica visible en ninguna pantalla | Mostrarlo violaría la filosofía "sin culpa" — es el mismo riesgo que el "efecto mascota muerta" ya descartado |

---

## 7. Lo que NO se debe construir en este MVP

- Subtareas complejas o etiquetas múltiples en el primer nivel
- Fechas/horas exactas obligatorias (la deadline es opcional)
- Tiendas con banners de recompensa agresivos o animaciones infinitas
- Cualquier mecánica de castigo visual (el gato no regaña, no llora de forma dramática, no muestra mensajes de culpa)
- Notificaciones push (versión móvil, no esta)
- Monetización vía microtransacciones que sustituyan el esfuerzo diario
- Mostrar `energy`/`burnout` como barra, número o métrica visible al usuario en cualquier pantalla — es un dato interno (ver invariante 5 y decisión de burnout en sección 6)

---

## 8. Dónde mirar si tienes dudas

- **Qué tarea toca ahora**: `plan.md`
- **Reglas de negocio**: este archivo, sección 4
- **De dónde viene cada decisión de producto**: brief original de investigación UX (encuestas, arquetipos, alertas UX) — si no lo tienes a mano, pide que te lo pasen antes de inventar una regla de producto nueva
