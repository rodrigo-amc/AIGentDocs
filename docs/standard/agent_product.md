---
type: agent_instructions
scope: product
version: 1.2
last_updated: 2026-03-01
sessions: ["01_product", "01_product_domain_modules"]
reads: "guide_product.md"
project_path: "project/01_product/"
---

# Instrucciones para Agentes — Contexto de Producto

Este archivo contiene las reglas operativas específicas para trabajar dentro de `project/01_product/`.
Antes de leer este archivo, asegúrate de haber leído el `AGENT.md` global en `standard/`.

---

## Propósito de este directorio

Aquí se define el **"Por qué"** del proyecto: la visión, el estado actual y los requerimientos funcionales por entidad de negocio. Todo lo que leas y escribas aquí debe estar en lenguaje de negocio, no en lenguaje técnico.

---

## Descubrimiento de Dominio (Knowledge Crunching — DDD)

Este estándar adopta principios de **Domain-Driven Design (DDD)** de Eric Evans para el descubrimiento del dominio del proyecto. Cuando trabajes en la creación de `vision.md`, no te limites a documentar lo que el usuario dice textualmente. Tu rol es actuar como **analista de dominio**: debes extraer, estructurar y devolver al usuario un modelo de dominio validado.

### Qué es DDD y por qué lo usamos

Domain-Driven Design (DDD) es una metodología de diseño de software que pone el **dominio del negocio** en el centro del proceso de desarrollo. Su premisa es que la complejidad del software radica en la complejidad del negocio, no en la tecnología. Por lo tanto, entender el dominio antes de diseñar o programar es el paso más crítico.

En el contexto de este estándar, DDD se aplica en la **fase de producto** para:
1. Descubrir las **entidades** del dominio (los conceptos centrales del negocio).
2. Establecer un **lenguaje ubicuo** (Ubiquitous Language) que todos los participantes — humanos y agentes — usen de forma consistente.
3. Identificar las **reglas de negocio** (invariantes) que gobiernan el comportamiento de cada entidad.
4. Definir las **relaciones** entre entidades para entender cómo interactúa el sistema.

### Proceso obligatorio al crear `vision.md`

Al trabajar con el usuario en la creación de `vision.md`, debes ejecutar el siguiente proceso de **Knowledge Crunching** (extracción de conocimiento del dominio):

**Paso 1 — Elicitación Narrativa**

Solicita al usuario que describa sus procesos de negocio en lenguaje natural. Guía la conversación con preguntas orientadas a descubrir entidades:

- *"¿Cuáles son las cosas (personas, objetos, conceptos) más importantes con las que trabaja su negocio?"*
- *"Cuando [actor] quiere [acción], ¿qué pasos sigue? ¿Qué cosas del negocio se involucran?"*
- *"¿Qué reglas o restricciones deben cumplirse para que eso funcione correctamente?"*
- *"¿Hay algo que nunca debería pasar en su negocio? ¿Qué lo impide?"*

**Paso 2 — Identificación y Clasificación (DDD)**

A partir del relato del usuario, identifica y clasifica según los conceptos de DDD:

| Qué buscar | Cómo identificarlo | Concepto DDD |
|---|---|---|
| **Sustantivos recurrentes** con identidad propia | El usuario se refiere a ellos con nombres propios o IDs: "el cliente X", "la orden #123" | **Entidad** |
| **Sustantivos descriptivos** sin identidad | El usuario los menciona como propiedades: "la dirección", "el rango de fechas" | **Value Object** |
| **Verbos y acciones** que los actores realizan | "Registrar", "Aprobar", "Cancelar", "Asignar" | **Comandos / Acciones** |
| **Restricciones o condiciones** | "No se puede X sin Y", "Siempre debe cumplir Z", "Solo si..." | **Regla de Negocio (Invariante)** |
| **Términos del negocio** con significado específico | Palabras que el usuario usa con un significado preciso que podría diferir del uso cotidiano | **Ubiquitous Language** |
| **Roles de usuario** que interactúan con el sistema | "El mecánico", "El administrador", "El cliente" | **Actores** (Usuarios Objetivo) |

**Paso 3 — Estructurar y Presentar para Validación**

Organiza los hallazgos y preséntalos al usuario en este formato:

1. **Entidades descubiertas**: Tabla con nombre, descripción de 1-2 líneas y relaciones de alto nivel.
2. **Reglas de negocio preliminares**: Lista agrupada por entidad, indicando qué restricciones mencionó el usuario.
3. **Términos del dominio**: Lista de términos candidatos para el Glosario con su definición propuesta.
4. **Actores identificados**: Roles de usuario con su descripción.

**Paso 4 — Validación Iterativa**

Presenta los hallazgos al usuario y solicita validación explícita:
- ¿Las entidades identificadas son correctas? ¿Falta alguna? ¿Alguna sobra?
- ¿Las relaciones son correctas?
- ¿Las reglas de negocio reflejan la realidad?
- ¿Los términos del glosario tienen el significado correcto?

Itera hasta que el usuario apruebe el modelo. Solo entonces, procede a completar `vision.md`.

### Dónde se documenta cada concepto DDD

Una vez validado el modelo con el usuario, documenta los resultados en los lugares correctos del estándar:

| Concepto DDD descubierto | Dónde se documenta | Nivel de detalle |
|---|---|---|
| Entidades | `vision.md` → **Mapa de Entidades del Dominio** | Nombre + descripción + relaciones de alto nivel |
| Ubiquitous Language | `vision.md` → **Glosario del Dominio** | Término + definición acordada |
| Actores | `vision.md` → **Usuarios Objetivo (Personas)** | Rol + descripción + nivel técnico |
| Entidades (detalle) | `domain_modules/[entidad].md` → Descripción, Atributos | Se crea en sesión posterior (`01_product_domain_modules`) |
| Reglas de Negocio | `domain_modules/[entidad].md` → Reglas de Negocio | Se formalizan en sesión posterior |
| Value Objects | `domain_modules/[entidad].md` → Atributos / Propiedades | Se documentan como propiedades complejas de la entidad |
| Agregados | `domain_modules/[entidad].md` → Relaciones + frontmatter `depends_on` | Se define en sesión posterior como relación de dependencia |

### Qué NO debes hacer durante el descubrimiento

- **No crees módulos de dominio durante la sesión `01_product`.** El descubrimiento produce el mapa; los módulos se crean en sesiones `01_product_domain_modules` posteriores.
- **No documentes atributos detallados en `vision.md`.** El mapa es estratégico (nombre, descripción, relaciones). El detalle va en el módulo.
- **No inventes entidades que el usuario no mencionó.** Si crees que falta una entidad, pregunta al usuario; no la agregues por cuenta propia.
- **No confundas Value Objects con Entidades.** Si algo no tiene identidad propia (no se referencia con un ID o nombre único), no es una entidad y no merece un módulo propio.

---

## Reglas Operativas

### vision.md

- Este archivo define el contexto estratégico del proyecto. **Léelo siempre al inicio de una sesión** para entender el propósito, los usuarios objetivo y el alcance.
- No lo modifiques a menos que el usuario lo solicite explícitamente. Los cambios en la visión son decisiones de alto nivel.

### roadmap.md (Tablero Kanban)

- **Antes de empezar cualquier tarea de implementación**, consulta el tablero de tareas en `project/01_product/roadmap.md` para verificar qué está en `[In Progress]` y qué sigue en `[To Do / Next]`.
- Si el usuario te pide trabajar en algo que no está en el tablero, **pregúntale si desea agregarlo** antes de proceder.
- Al completar una tarea, muévela a `[Done]`. Al iniciar una nueva, muévela a `[In Progress]`.
- Nunca modifiques la sección de `Fase/Hito Actual` sin aprobación del usuario.

### domain_modules/ (Módulos de Dominio)

- Al crear un nuevo módulo, sigue estrictamente la estructura definida en `guide_domain_modules.md`. Completa todas las secciones `[OBLIGATORIO]` y el frontmatter YAML.
- Respeta las **Guías de Tamaño y Granularidad**:
  - Si una User Story tiene **más de 6 Criterios de Aceptación**, propon dividirla.
  - Si una User Story afecta **más de 2 módulos de dominio**, propon dividirla.
  - Si un módulo supera las **300 líneas**, evalúa si debe separarse en submódulos.
- Al redactar User Stories, usa siempre el formato: *"Como [rol], quiero [acción], para [valor]"*. Evita descripciones técnicas de implementación.
- Los Criterios de Aceptación (AC) deben ser lo suficientemente claros como para que un desarrollador o un agente de IA pueda escribir un test automatizado directamente a partir de ellos.
- Cuando el usuario te describa un requerimiento de forma informal, tu rol como analista es transformar esa descripción en una User Story estructurada con ACs verificables. Presenta el resultado al usuario para su aprobación antes de registrarlo.

---

## Modo Onboarding — Ingeniería Inversa de Producto

Cuando estés en **Modo Onboarding** (proyecto existente con documentación vacía), este directorio se completa **después** de `project/03_engineering/` y `project/02_architecture/`. El flujo es:

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
