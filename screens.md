# screens.md — MyThingsToDo

> Documento hermano de `plan.md` y `CONTEXT.md`. Este archivo no dice _cómo_ construir cada componente (eso es CONTEXT.md) ni _cuándo_ tocarlo (eso es plan.md) — dice **qué pantallas existen y qué componentes necesita cada una**, fruto de una revisión de huecos sobre el plan original de Semana 2.
>
> Si una pantalla o componente de aquí no aparece en `plan.md`, es porque surgió de esta revisión y aún no tiene semana asignada — hay que incorporarlo al plan, no ignorarlo.

---

## 1. Resumen de pantallas

| Pantalla                          | Requiere login                                                     | Descripción                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landing**                       | No                                                                 | Pública, antes de cualquier interacción. Vende la app.                                                                                                           |
| **Home / Diario (modo invitado)** | No                                                                 | El usuario puede crear y gestionar tareas sin haber iniciado sesión.                                                                                             |
| **Login**                         | —                                                                  | Google OAuth vía NextAuth. Se pide en un momento a decidir (ver sección 7).                                                                                      |
| **Onboarding**                    | No (puede pasar en modo invitado)                                  | 4 pasos. Paso 3 (notificaciones) se refiere a avisos **dentro de la web** (toasts), no push del sistema. La respuesta se guarda para uso futuro en la app móvil. |
| **El Refugio (Home)**             | No (funcional en invitado)                                         | PetWidget centrado, tarea activa destacada, navegación a Diario/Tienda.                                                                                          |
| **El Diario (Tasks)**             | No (funcional en invitado)                                         | ProgressBar, StreakIndicator, DragList de tareas, FloatingAddButton.                                                                                             |
| **Calendario**                    | No (funcional en invitado)                                         | Vista propia (no widget compacto). Drag para reagendar tareas entre días.                                                                                        |
| **Tienda**                        | Sí, en la práctica (equipar/comprar liga al progreso de la cuenta) | Tabs por categoría, grid de items, lógica de equipar con invariante 3+1.                                                                                         |
| **Settings**                      | Sí                                                                 | Pantalla mínima. Logout como mínimo indispensable.                                                                                                               |

---

## 2. Flujo de entrada

```
Landing → (usar la app sin cuenta: Home / Diario / Calendario) → Login (en el momento que se decida) → cuenta vinculada
                                                                → Onboarding (puede pasar antes o después del login)
```

El usuario puede tocar tareas, completar tareas y usar el calendario **sin haber iniciado sesión**. El login se solicita en un punto que aún no está decidido (ver sección 8).

---

## 3. Componentes compartidos / transversales

Estos no pertenecen a una sola pantalla — viven en el Shell o se reutilizan en varias.

- **AppShell** — layout compartido: navegación inferior/lateral + header + `CoinCounter`. Ninguna pantalla con navegación reconstruye esto por su cuenta.
- **CoinCounter** — vive dentro de AppShell, no es un componente suelto.
- **RewardToast** — toast (vía Sonner / shadcn) que se dispara en eventos de recompensa (subir de nivel, completar el progreso diario). Acompañado de animación del gato, nunca interrumpe la pantalla con un modal.
- **EmptyState** — reutilizable. Cubre Diario sin tareas y categorías de Tienda sin items. El mensaje en vacío es parte de la personalidad del gato, no un hueco frío de "no hay nada aquí".
- **PetWidget** — componente con **variantes de tamaño** (completa / compacta) para poder aparecer en todas las pantallas relevantes (Home, Diario, Tienda), y con **triggers de animación** independientes del mood:
  - `mood` → feliz / neutral / triste (estático en Semana 2, animado después)
  - `levelUp` → reacciona junto al RewardToast
  - `equipChange` → se mueve al equipar o quitar un objeto en Tienda

  Importante: si PetWidget reacciona a cambios de equipamiento, tiene que estar visible (aunque sea en versión compacta) mientras el usuario está en Tienda — si no, esa reacción nunca se ve.

---

## 4. Componentes por pantalla

### Landing

- Hero/intro (sin componente de lógica de negocio, es contenido estático)
- CTA hacia "usar la app" (no hacia login directamente)

### Home / Diario en modo invitado

- Mismos componentes que sus versiones con cuenta (ver abajo). No hay una versión "reducida" — la app es la misma, lo que cambia es si los datos están atados a una cuenta o no.

### Onboarding (4 pasos)

- Wizard con stepper
- Paso 1: ¿Trabajo / Vida cotidiana / Ambos?
- Paso 2: ¿Cuánto tiempo quieres dedicar a ser productivo al día?
- Paso 3: ¿Quieres avisos dentro de la web cuando pase algo bueno? (se guarda la respuesta; no implica push)
- Paso 4: ¿Te interesa un modo "focus"?
- Respuestas a estado local esta semana, persistencia real en Semana 3

### El Refugio (Home)

- PetWidget (completa)
- Globo de texto motivacional
- Tarjeta de "tu tarea activa"
- Navegación hacia Diario y Tienda (vía AppShell)

### El Diario (Tasks)

- ProgressBar (ver diseño definido en sección 5)
- StreakIndicator
- DragList — contexto de drag para **reordenar prioridad** dentro de la lista
- TaskCard (estados normal/urgente/completada, indicador de tipo emocional)
- FloatingAddButton + NewTaskForm en **modo dual**: mismo componente para crear y editar (en edición, valores precargados, botón "Guardar cambios")
- PetWidget (compacta, opcional esta semana)

### Calendario

- CalendarView — componente nuevo, vista propia (no cabe como widget pequeño)
- Contexto de drag distinto al de DragList: **reagendar**, arrastrar una tarea de un día a otro cambia su deadline
- Nota: dos contextos de drag en la app (reordenar vs reagendar) usan la misma librería (`@dnd-kit`) pero son interacciones independientes — no compartir lógica entre ambos sin pensarlo

### Tienda

- Tabs por categoría: Mascotas / Animaciones / Decoración / Accesorios
- Grid de items con precio
- Lógica visual de "equipar" (estado local), bloqueo si se viola invariante 3+1, con toast de aviso
- CoinCounter con botón "conseguir más" (placeholder)
- PetWidget (compacta) — necesaria aquí para mostrar el trigger `equipChange`

### Settings

- Pantalla mínima
- Logout
- (resto del contenido a definir, no bloquea esta semana)

---

## 5. ProgressBar — diseño definido

Se descartó la estética de barra horizontal con porcentaje (demasiado parecida a un dashboard de métricas, justo lo que se quiso evitar al ocultar `energy`/`burnout`).

**Diseño:** un camino (path) que el gato recorre a medida que se completan tareas del día. El final del camino es la recompensa del día.

Reglas de diseño:

- Sin rojo, sin "vas atrasado", sin contador numérico frío.
- En cero tareas completadas: el gato está al inicio del camino, estado neutral — nunca un aspecto triste o de alarma por no haber empezado.
- Al completar el recorrido: dispara `RewardToast` + animación de gato feliz (mismo mecanismo ya definido para level up).
- Es la misma idea de "progreso" que una barra tradicional, pero la piel visual está narrada desde el personaje, no desde una métrica.

---

## 6. Componentes nuevos sobre el plan original de Semana 2

| Componente   | Por qué se añadió                                                                   |
| ------------ | ----------------------------------------------------------------------------------- |
| AppShell     | Nav y CoinCounter aparecían sueltos en distintas pantallas sin un layout compartido |
| CalendarView | El calendario pasó de widget decorativo a vista propia con drag para reagendar      |
| RewardToast  | No existía ningún componente para el momento de alcanzar una recompensa/nivel       |
| EmptyState   | Diario y Tienda pueden quedar vacíos y no había componente para ese caso            |
| Landing      | Faltaba pantalla pública antes del uso de la app                                    |
| Settings     | Faltaba un sitio para el logout, como mínimo                                        |

---

## 7. Nota de arquitectura pendiente (importante, no es de esta semana)

El modo invitado introduce un problema que `CONTEXT.md` no contempla todavía: ese archivo asume que toda Server Action pasa por un usuario autenticado (NextAuth + Prisma por usuario).

Con modo invitado, las tareas creadas **antes** de tener cuenta tienen que vivir en algún sitio — típicamente almacenamiento local en el navegador o una sesión anónima — y cuando el usuario hace login, esos datos tienen que "adoptarse" a su cuenta real (migrar de almacenamiento temporal a la base de datos, asociados a su `userId`).

Esto **no se resuelve en Semana 2** (sigue siendo mock data), pero hay que decidirlo antes de tocar Server Actions reales en Semana 3, porque cambia cómo se diseña la capa `lib/actions/` para tareas: necesita poder operar tanto sobre datos "anónimos" como sobre datos de un usuario real, y un paso de migración entre ambos.

---

## 8. Pendiente de decidir (no bloquea esta semana)

- **Trigger exacto para pedir login**: ¿después de completar X tareas? ¿al intentar acceder a Tienda? ¿al cerrar la pestaña/sesión? Esto determina parte de la lógica de Home/Diario en modo invitado.
