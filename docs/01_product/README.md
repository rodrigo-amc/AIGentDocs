# 01_product — Contexto de Producto

Este directorio contiene la inteligencia de negocio del proyecto. Es fundamental para que los agentes entiendan *para qué* están programando y eviten soluciones técnicamente válidas pero funcionalmente incorrectas.

---

## Archivos de este directorio

### `vision.md` — Visión del Producto (PRD Estratégico)

Define el "por qué" del proyecto a nivel global. Es el **PRD de alto nivel** que establece los objetivos estratégicos antes de entrar al detalle táctico de los módulos.

| Sección | Tipo | Descripción |
|---|---|---|
| Elevator Pitch | **[OBLIGATORIO]** | Qué es el producto en 2-3 líneas. Debe responder: ¿Qué hace? ¿Para quién? ¿Qué problema resuelve? |
| Problema que Resuelve | **[OBLIGATORIO]** | Descripción del dolor o necesidad del usuario que motiva la existencia del proyecto. |
| Usuarios Objetivo (Personas) | **[OBLIGATORIO]** | Perfiles de los usuarios del sistema: quiénes son, qué rol cumplen, qué nivel técnico tienen. |
| Alcance del Proyecto | **[OBLIGATORIO]** | Qué está **dentro** y qué está **fuera** del alcance. Evita que el agente implemente funcionalidades no planificadas. |
| Glosario del Dominio | **[OBLIGATORIO]** | Terminología unificada del negocio (Ubiquitous Language según DDD). Los términos se descubren durante el proceso de Knowledge Crunching definido en `AGENT.md`. |
| Mapa de Entidades del Dominio | **[OBLIGATORIO]** | Entidades descubiertas mediante Knowledge Crunching (DDD). Cada entidad incluye: nombre canónico, descripción de 1-2 líneas y relaciones de alto nivel con otras entidades. Este mapa es la fuente para la creación de archivos en `domain_modules/`. No incluir atributos detallados ni reglas de negocio — esos viven en el módulo correspondiente. |
| Modelo de Negocio | **[OPCIONAL]** | Cómo genera valor el producto. |
| Restricciones de Negocio | **[OPCIONAL]** | Limitaciones legales, regulatorias o contractuales. |

**Frontmatter esperado:**

```yaml
---
type: vision
version: 1.0
last_updated: YYYY-MM-DD
---
```

---

### `roadmap.md` — Estado y Planificación

Proporciona el contexto temporal y la priorización de las tareas. Funciona como un **Tablero Kanban** para que desarrolladores y agentes de IA sepan exactamente en qué trabajar, coordinándose con los estados de los `domain_modules/`.

| Sección | Tipo | Descripción |
|---|---|---|
| Fase/Hito Actual | **[OBLIGATORIO]** | Contexto macro del desarrollo actual (Ej. "MVP", "Sprint 2"). |
| Tablero de Tareas | **[OBLIGATORIO]** | Lista accionable de User Stories o tareas técnicas. |
| Próximos Hitos | **[OPCIONAL]** | Visión a largo plazo de lo que vendrá después del hito actual. |

**Reglas del Tablero de Tareas (Kanban):**
- **`[In Progress]`**: Tarea actual en desarrollo. Máximo 1 o 2 ítems. Es el foco absoluto.
- **`[To Do / Next]`**: Backlog priorizado estrictamente de arriba hacia abajo. Si `In Progress` está vacío, se toma el ítem superior.
- **`[Blocked / Review]`**: Tareas detenidas por bloqueos externos o pendientes de revisión.
- **`[Done]`**: Tareas completadas del hito actual.

*Nota: El roadmap interactúa mediante referencias (ej. `[US-03] Implementar login (ver clients.md)`). Los detalles funcionales siempre viven en el módulo de dominio.*

**Frontmatter esperado:**

```yaml
---
type: roadmap
version: 1.0
last_updated: YYYY-MM-DD
current_phase: ""    # Fase actual del proyecto (ej: "MVP", "Beta", "Producción")
---
```

### `quality_attributes.md` — Requerimientos No Funcionales

Centraliza los Atributos de Calidad del sistema (rendimiento, seguridad, disponibilidad, etc.). Define el estándar de "Cómo" debe comportarse el sistema bajo ciertas condiciones (NFRs). Estos requisitos actúan como restricciones de negocio que moldean la Arquitectura.

| Sección | Tipo | Descripción |
|---|---|---|
| Rendimiento | **[OBLIGATORIO]** | Tiempos de respuesta esperados, latencia y throughput bajo carga. |
| Seguridad | **[OBLIGATORIO]** | Autenticación, autorización, encriptación en tránsito/reposo, protección contra amenazas (OWASP). |
| Usabilidad | **[OPCIONAL]** | Facilidad de uso, accesibilidad (WCAG) y curva de aprendizaje. |
| Disponibilidad | **[OPCIONAL]** | Tiempo de actividad (SLAs), tolerancia a fallos y recuperación ante desastres. |
| Escalabilidad | **[OPCIONAL]** | Capacidad de crecer ante el aumento de demanda. |
| Mantenibilidad | **[OPCIONAL]** | Facilidad para modificar el sistema sin introducir errores. |

**Estructura de un Atributo de Calidad:**

Cada atributo debe documentarse usando el formato de **Escenario de Atributo de Calidad**:

1. **Fuente del Estímulo**: Quién genera el evento (usuario, sistema, atacante).
2. **Estímulo**: El evento en sí (solicitud de datos, ataque de fuerza bruta, falla de servidor).
3. **Entorno**: Condiciones bajo las cuales ocurre (carga normal, pico de tráfico, modo mantenimiento).
4. **Respuesta**: Qué debe hacer el sistema.
5. **Medida de Respuesta**: La métrica verificable (ej: "en menos de 2 segundos", "bloquear IP tras 3 intentos").

**Frontmatter esperado:**

```yaml
---
type: quality_attributes
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
---
```

**Guía de Llenado:**
- **Proyecto nuevo:** Definir al menos los atributos de Rendimiento y Seguridad antes de implementar.
- **Proyecto existente:** Los Atributos de Calidad deben revisarse cada vez que un ADR impacte de forma significativa el comportamiento del sistema.
- **Validación:** Cada medida de respuesta debería estar vinculada a una prueba en `testing_strategy.md`.

---

### `domain_modules/` — Módulos de Dominio (PRD Modular + Backlog)

Este es el nivel donde viven los **requerimientos funcionales detallados**. Cada archivo de módulo funciona como un "PRD Modular" y un "Backlog" de la entidad.

Ver `domain_modules/README.md` para las instrucciones sobre cómo documentar **User Stories** y **Criterios de Aceptación (AC)** por módulo.
