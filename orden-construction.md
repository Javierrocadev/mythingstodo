# orden-construccion.md — MyThingsToDo

> Lista de tareas exhaustiva siguiendo el razonamiento: esqueleto compartido primero, luego pantallas en orden de riesgo/dependencia (Home → Diario → Calendario → Tienda → Onboarding/Login/Landing/Settings), y los componentes transversales (EmptyState, RewardToast) se construyen la primera vez que una pantalla los necesita, no antes.
>
> Sigue siendo Semana 2: mock data, cero Server Actions, cero IA. Companion de `plan.md`, `CONTEXT.md` y `screens.md`.

---

## Fase 0 — Esqueleto del Shell

- [x] Crear rutas vacías: `/`, `/login`, `/onboarding`, `/home`, `/tasks`, `/calendar`, `/shop`, `/settings`
- [x] `AppShell`: layout con header + navegación inferior/lateral
- [x] `CoinCounter` (valor mock fijo) integrado dentro del header de `AppShell`
- [x] Verificar que la navegación entre rutas funciona antes de meter contenido real en ninguna

---

## Fase 1 — Home (valida Shell + los dos componentes base)

- [x] `PetWidget`
  - [x] 3 estados de mood: feliz / neutral / triste (estático)
  - [x] Prop de tamaño preparada (`full` / `compact`) aunque hoy solo se use `full`
  - [x] Globo de texto motivacional encima (frases hardcodeadas)
- [x] `TaskCard`
  - [x] Estado normal / urgente / completada (visual diferenciado)
  - [x] Indicador de tipo emocional
  - [x] Checkbox/gesto de completar → callback `onComplete` (sin lógica real aún)
- [x] Layout de pantalla Home: `PetWidget` centrado + tarjeta de "tu tarea activa" (mock, primera tarea del array)
- [ ] Confirmar que la navegación hacia Diario y Tienda funciona desde aquí

---

## Fase 2 — El Diario (núcleo real de la app)

- [x] `StreakIndicator` (icono de fuego + número de días, mock)
- [x] `ProgressBar` — diseño "camino + gato"
  - [x] Ilustración/SVG del camino
  - [x] Posición del gato sobre el camino según % de tareas completadas (mock)
  - [x] Estado en cero tareas: gato al inicio, neutral — nunca triste ni de alarma
- [x] `DragList`
  - [x] Instalar `@dnd-kit/core` + `@dnd-kit/sortable`
  - [x] Integrar con mock data (5-6 tareas variadas)
  - [x] Verificar reorder visual fluido — este es el contexto de drag de **reordenar prioridad**
- [x] `NewTaskForm` (modo dual: crear / editar)
  - [x] Input de título (único campo libre)
  - [x] Botones predefinidos de urgencia: Para ya / Hoy / Margen
  - [x] Botones predefinidos de tipo emocional: Satisfactoria / Normal / Aburrida / Agotadora
  - [x] Toggle opcional: ¿añadir al calendario? (deadline)
  - [x] Input opcional: tiempo estimado
  - [x] Modo edición: mismo componente, valores precargados, botón pasa a "Guardar cambios"
- [x] `FloatingAddButton` → abre `NewTaskForm` en modo crear
- [x] Conectar `TaskCard` (tap/icono editar) → abre `NewTaskForm` en modo editar
- [x] `EmptyState` **(primera construcción)** — usarlo aquí si el array mock de tareas está vacío
- [x] `RewardToast` **(primera construcción)** — se dispara al completar el camino del `ProgressBar`
  - [x] Toast vía shadcn/Sonner
  - [ ] Trigger `levelUp` en `PetWidget` sincronizado con el toast
- [ ] Resaltado visual de la tarea recomendada (la primera del orden)

---

## Fase 3 — Calendario (depende de la forma de datos de tareas ya definida en Fase 2)

- [x] `CalendarView` — vista propia, no widget compacto dentro de Diario
  - [x] Mostrar deadlines de las tareas mock en su día correspondiente
  - [ ] Segundo contexto de drag (`@dnd-kit`): arrastrar una tarea de un día a otro cambia su deadline (mock, sin persistir)
  - [x] Confirmar que este drag NO comparte estado/lógica con el de `DragList` — son interacciones distintas aunque usen la misma librería

---

## Fase 4 — Tienda (independiente del resto; buen momento porque PetWidget y toasts ya existen)

- [x] Tabs/secciones por categoría: Mascotas / Animaciones / Decoración / Accesorios
- [x] Grid de items mock por categoría con precio
- [x] Lógica visual de "equipar" (estado local, sin persistir)
  - [x] Resaltar el ítem equipado
  - [x] Bloquear selección si ya hay 3 ítems en Accesorios+Decoración, o 1 en Mascotas, o 1 en Animaciones (invariante 3+1)
  - [x] Toast de aviso cuando se intenta violar el invariante
- [x] `PetWidget` — primera vez que se usa fuera de Home: validar aquí la variante `compact`
  - [ ] Trigger `equipChange`: el gato reacciona al equipar/quitar un objeto
- [ ] `CoinCounter` con botón "conseguir más" (placeholder, sin lógica de anuncios)

---

## Fase 5 — Onboarding, Login, Landing, Settings (menor riesgo, no enseñan nada nuevo de construir antes)

- [ ] **Landing**
  - [ ] Hero/intro estático
  - [ ] CTA hacia "usar la app" (no hacia login)
- [ ] **Onboarding** (wizard 4 pasos)
  - [ ] Paso 1: ¿Trabajo / Vida cotidiana / Ambos?
  - [ ] Paso 2: ¿cuánto tiempo quieres dedicar a ser productivo al día?
  - [ ] Paso 3: ¿avisos dentro de la web cuando pase algo bueno? (sí/no) — se guarda la respuesta para la futura app móvil, sin lógica de push
  - [ ] Paso 4: ¿interés en modo "focus"?
  - [ ] Guardar respuestas en estado local
- [ ] **Login**
  - [ ] Pantalla con botón "Continuar con Google" (sin NextAuth real todavía, sigue siendo mock)
  - [ ] ⚠️ Decisión pendiente antes de cerrar esta fase: trigger exacto que solicita el login (¿tras completar X tareas? ¿al entrar a Tienda? ¿al cerrar pestaña/sesión?)
- [ ] **Settings**
  - [ ] Logout (mínimo indispensable)
  - [ ] Resto del contenido, a definir más adelante, no bloquea

---

## Fuera de esta lista, pero no perder de vista antes de Semana 3 (Server Actions reales)

- [ ] Resolver cómo se guardan las tareas creadas en modo invitado (almacenamiento local / sesión anónima) y cómo se "adoptan" a la cuenta real al hacer login — detalle completo en `screens.md`, sección 7
