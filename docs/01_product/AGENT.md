# Instrucciones para Agentes — Contexto de Producto

Este archivo contiene las reglas operativas específicas para trabajar dentro de `01_product/`.
Antes de leer este archivo, asegúrate de haber leído el `AGENT.md` global en `docs/`.

---

## Propósito de este directorio

Aquí se define el **"Por qué"** del proyecto: la visión, el estado actual y los requerimientos funcionales por entidad de negocio. Todo lo que leas y escribas aquí debe estar en lenguaje de negocio, no en lenguaje técnico.

---

## Reglas Operativas

### vision.md

- Este archivo define el contexto estratégico del proyecto. **Léelo siempre al inicio de una sesión** para entender el propósito, los usuarios objetivo y el alcance.
- No lo modifiques a menos que el usuario lo solicite explícitamente. Los cambios en la visión son decisiones de alto nivel.

### roadmap.md (Tablero Kanban)

- **Antes de empezar cualquier tarea de implementación**, consulta el tablero de tareas en `01_product/roadmap.md` para verificar qué está en `[In Progress]` y qué sigue en `[To Do / Next]`.
- Si el usuario te pide trabajar en algo que no está en el tablero, **pregúntale si desea agregarlo** antes de proceder.
- Al completar una tarea, muévela a `[Done]`. Al iniciar una nueva, muévela a `[In Progress]`.
- Nunca modifiques la sección de `Fase/Hito Actual` sin aprobación del usuario.

### domain_modules/ (Módulos de Dominio)

- Al crear un nuevo módulo, sigue estrictamente la estructura definida en `01_product/domain_modules/README.md`. Completa todas las secciones `[OBLIGATORIO]` y el frontmatter YAML.
- Respeta las **Guías de Tamaño y Granularidad**:
  - Si una User Story tiene **más de 6 Criterios de Aceptación**, propon dividirla.
  - Si una User Story afecta **más de 2 módulos de dominio**, propon dividirla.
  - Si un módulo supera las **300 líneas**, evalúa si debe separarse en submódulos.
- Al redactar User Stories, usa siempre el formato: *"Como [rol], quiero [acción], para [valor]"*. Evita descripciones técnicas de implementación.
- Los Criterios de Aceptación (AC) deben ser lo suficientemente claros como para que un desarrollador o un agente de IA pueda escribir un test automatizado directamente a partir de ellos.
- Cuando el usuario te describa un requerimiento de forma informal, tu rol como analista es transformar esa descripción en una User Story estructurada con ACs verificables. Presenta el resultado al usuario para su aprobación antes de registrarlo.

---

## Modo Onboarding — Ingeniería Inversa de Producto

Cuando estés en **Modo Onboarding** (proyecto existente con documentación vacía), este directorio se completa **después** de `03_engineering/` y `02_architecture/`. El flujo es:

### Paso 1: Completar `vision.md`

Analiza el código fuente, el README del repositorio y cualquier documentación existente fuera de `docs/` para:

- Redactar el **Elevator Pitch**: qué hace el producto, para quién y qué problema resuelve.
- Identificar los **Usuarios Objetivo** a partir de los roles, permisos o interfaces del código.
- Definir el **Alcance** actual: qué funcionalidades existen (dentro) y qué no se ha implementado (fuera).
- Construir el **Glosario del Dominio** a partir de los nombres de entidades, modelos y variables del código.

### Paso 2: Crear `domain_modules/`

Analiza la estructura del código para identificar las entidades de dominio:

- **Busca modelos, schemas, entidades o clases principales** del código fuente.
- **Cada entidad de negocio significativa** se convierte en un archivo `[entidad].md` en `domain_modules/`.
- Las User Stories se redactan como funcionalidad **ya implementada**: *"Como [rol], quiero [acción], para [valor]"*, describiendo lo que el sistema ya hace.
- El `state` del frontmatter se establece según la realidad:
  - Funcionalidad completamente implementada → `state: done`
  - Funcionalidad parcialmente implementada → `state: doing`
  - Funcionalidad planificada pero no implementada → `state: pending`
- El campo `code_paths` debe apuntar a los archivos o directorios reales del código.

### Paso 3: Configurar `roadmap.md`

- Las tareas completadas van a `[Done]`.
- Las features pendientes, bugs conocidos o mejoras van a `[To Do / Next]`.
- La tarea activa actual (lo que se va a trabajar primero) va a `[In Progress]`.

> **Importante:** Siempre presenta los borradores al usuario para revisión. El agente genera, el humano aprueba.
