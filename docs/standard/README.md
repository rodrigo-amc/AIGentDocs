# Estándar de Documentación para Ingeniería de Software Aumentada por IA

Este repositorio contiene un **framework de documentación como código** diseñado para que agentes de IA puedan entender, documentar y desarrollar proyectos de software de forma eficiente. Se puede adoptar tanto en proyectos nuevos como en proyectos existentes.

---

## Tabla de Contenidos

<!-- [OBLIGATORIO] Índice completo con rutas relativas a cada archivo de /docs. Debe mantenerse actualizado. -->

### Estándar (`standard/`)

- [README.md](./README.md) — Este archivo (punto de entrada)
- [AGENT.md](./AGENT.md) — Instrucciones operativas globales para agentes de IA
- [AGENT_REVIEW.md](./AGENT_REVIEW.md) — Prompt de auditoría de documentación
- [QUICKSTART.md](./QUICKSTART.md) — Guía de uso del framework
- [changelog.yaml](./changelog.yaml) — Historial de versiones del estándar

#### Guías de Estructura y Formato

- [guide_product.md](./guide_product.md) — Instrucciones para los archivos de producto
- [guide_domain_modules.md](./guide_domain_modules.md) — Instrucciones para módulos de dominio
- [guide_architecture.md](./guide_architecture.md) — Instrucciones para los Design Docs
- [guide_engineering.md](./guide_engineering.md) — Instrucciones para estándares de ingeniería
- [guide_adrs.md](./guide_adrs.md) — Instrucciones para Architecture Decision Records

#### Instrucciones para Agentes (por contexto)

- [agent_product.md](./agent_product.md) — Reglas operativas: producto (DDD, Onboarding)
- [agent_architecture.md](./agent_architecture.md) — Reglas operativas: arquitectura
- [agent_engineering.md](./agent_engineering.md) — Reglas operativas: ingeniería
- [agent_adrs.md](./agent_adrs.md) — Reglas operativas: ADRs

#### Templates de Referencia (`standard/templates/`)

- [vision.md](./templates/vision.md)
- [roadmap.md](./templates/roadmap.md)
- [quality_attributes.md](./templates/quality_attributes.md)
- [domain_module.md](./templates/domain_module.md)
- [system_overview.md](./templates/system_overview.md)
- [data_flow.md](./templates/data_flow.md)
- [infrastructure.md](./templates/infrastructure.md)
- [tech_stack.yaml](./templates/tech_stack.yaml)
- [testing_strategy.md](./templates/testing_strategy.md)
- [api_guidelines.md](./templates/api_guidelines.md)

### Documentos del Proyecto (`project/`)

- `project/01_product/` — vision.md, roadmap.md, quality_attributes.md, domain_modules/
- `project/02_architecture/` — system_overview.md, data_flow.md, infrastructure.md
- `project/03_engineering/` — tech_stack.yaml, testing_strategy.md, api_guidelines.md
- `project/04_adrs/` — [NNNN]-[title].md

---

## Filosofía del Estándar

Este estándar está **diseñado para ser consumido por agentes de IA** como audiencia principal. La estructura de directorios, la modularización de los documentos y los protocolos de lectura están optimizados para que un agente pueda entender el contexto de un proyecto de software de forma eficiente, minimizando el uso de ventana de contexto y tokens.

Todos los documentos deben mantener un **formato legible por humanos** — los humanos son quienes crean, revisan y aprueban el contenido. Sin embargo, las decisiones de diseño del estándar (qué documentar, dónde ubicarlo, cómo estructurarlo y cómo navegarlo) priorizan la interacción con agentes de IA.

> **Nota sobre el idioma:** El idioma de la documentación queda a consideración del equipo de desarrollo de cada proyecto.

---

## Estructura de Directorios

```text
/docs
├── standard/                              # El framework (instrucciones, reglas, templates)
│   ├── README.md                          # Este archivo (punto de entrada)
│   ├── AGENT.md                           # Instrucciones operativas globales y gestión de sesiones
│   ├── AGENT_REVIEW.md                    # Prompt de auditoría de documentación (bajo demanda)
│   ├── QUICKSTART.md                      # Guía de uso del framework
│   ├── changelog.yaml                     # Historial de versiones del estándar
│   │
│   ├── guide_product.md                   # Estructura y formato de 01_product
│   ├── guide_domain_modules.md            # Estructura y formato de domain_modules
│   ├── guide_architecture.md              # Estructura y formato de 02_architecture
│   ├── guide_engineering.md               # Estructura y formato de 03_engineering
│   ├── guide_adrs.md                      # Estructura y formato de 04_adrs
│   │
│   ├── agent_product.md                   # Reglas operativas: producto (DDD, Onboarding)
│   ├── agent_architecture.md              # Reglas operativas: arquitectura
│   ├── agent_engineering.md               # Reglas operativas: ingeniería
│   ├── agent_adrs.md                      # Reglas operativas: ADRs
│   │
│   └── templates/                         # Templates de referencia para agentes
│       ├── vision.md
│       ├── roadmap.md
│       ├── quality_attributes.md
│       ├── domain_module.md
│       ├── system_overview.md
│       ├── data_flow.md
│       ├── infrastructure.md
│       ├── tech_stack.yaml
│       ├── testing_strategy.md
│       └── api_guidelines.md
│
└── project/                               # Documentos del proyecto (vacío por defecto)
    ├── 01_product/
    │   ├── vision.md                      # Visión del producto, Elevator Pitch, Alcance y Mapa de Entidades (DDD)
    │   ├── roadmap.md                     # Estado actual del proyecto, hitos y futuro
    │   ├── quality_attributes.md          # Requerimientos No Funcionales
    │   └── domain_modules/                # Requerimientos modularizados por entidad de dominio
    │       └── [module_name].md
    ├── 02_architecture/
    │   ├── system_overview.md             # Diagramas C4, estructura de carpetas y patrones
    │   ├── data_flow.md                   # Flujos de datos y modelo de datos
    │   └── infrastructure.md              # Topología, despliegue y CI/CD
    ├── 03_engineering/
    │   ├── tech_stack.yaml                # Stack tecnológico exacto (YAML)
    │   ├── testing_strategy.md            # Estrategia de pruebas y cobertura
    │   └── api_guidelines.md              # [CONDICIONAL] Solo si se exponen endpoints
    └── 04_adrs/
        └── [NNNN]-[title].md              # Registros de decisiones individuales
```

---

## Secciones que debe contener este archivo en un proyecto

| Sección | Tipo | Descripción |
|---|---|---|
| Nombre del Proyecto | **[OBLIGATORIO]** | Nombre oficial y descripción del proyecto en 1-2 líneas. |
| Tabla de Contenidos | **[OBLIGATORIO]** | Índice completo con rutas relativas a cada archivo de `/docs`. Debe mantenerse actualizado ante cualquier cambio en la estructura. |
| Protocolo de Lectura | **[OBLIGATORIO]** | Orden secuencial de lectura recomendado para entender el proyecto (ver guía abajo). |
| Protocolo de Mantenimiento | **[OBLIGATORIO]** | Reglas para editar, crear o eliminar archivos de documentación (ver guía abajo). |
| Convenciones | **[OBLIGATORIO]** | Idioma elegido, formato de fechas, estilo de escritura. |
| Historial de Versiones | **[OBLIGATORIO]** | Registro estructurado de cambios del estándar en `changelog.yaml`. |

> **Nota:** Al adoptar el framework en un proyecto, el encabezado de este archivo debe reemplazarse con el nombre y descripción del proyecto concreto.

---

## Guía de Adopción

### Proyecto Nuevo (Greenfield)

Si el proyecto aún no tiene código, llenar la documentación **antes de implementar**:

1. Copiar `templates/vision.md` a `project/01_product/vision.md` → Definir qué se va a construir.
2. Crear los `domain_modules/` necesarios a partir de `templates/domain_module.md`.
3. Copiar `templates/roadmap.md` a `project/01_product/roadmap.md` → Priorizar las tareas.
4. Copiar templates de arquitectura a `project/02_architecture/` → Diseñar system_overview, data_flow, infrastructure.
5. Copiar `templates/tech_stack.yaml` a `project/03_engineering/` → Elegir tecnologías (con ADRs).
6. Copiar `templates/testing_strategy.md` a `project/03_engineering/` → Estrategia de tests.
7. Implementar el código siguiendo la documentación.

### Proyecto Existente (Brownfield)

Si el proyecto ya tiene código, documentar por **ingeniería inversa**. El orden es diferente — se parte de lo concreto (código) hacia lo abstracto (producto):

1. **`project/03_engineering/tech_stack.yaml`** → Analizar el código y registrar las tecnologías reales.
2. **`project/02_architecture/system_overview.md`** → Diagramar la arquitectura que ya existe.
3. **`project/02_architecture/infrastructure.md`** → Documentar dónde y cómo corre.
4. **`project/01_product/vision.md`** → Describir qué hace el producto y para quién.
5. **`project/01_product/domain_modules/`** → Identificar entidades del código y crear módulos con User Stories documentadas como ya implementadas (`state: done`).
6. **`project/01_product/roadmap.md`** → Usar el tablero para planificar lo que **falta**: nuevas features, refactors, bugs.
7. **`project/04_adrs/`** → Crear ADRs retroactivos (`status: accepted`) para las decisiones técnicas ya tomadas.

> **Tip:** Un agente de IA puede acelerar enormemente el paso de Brownfield. Puede analizar el código fuente y generar borradores de la documentación para revisión humana. Ver `AGENT.md` para el Modo Onboarding.

---

## Protocolo de Lectura

Orden en que un agente nuevo debe consumir la documentación para orientarse contextualmente con el menor costo de tokens:

1. **`standard/AGENT.md`** → Entender las reglas operativas globales.
2. **`project/01_product/roadmap.md`** → Identificar en qué hito/sprint estamos y tomar la tarea Activa (`[In Progress]`).
3. **`project/01_product/domain_modules/[modulo_afectado].md`** → Leer **SOLO** el módulo (o módulos) directamente mencionado(s) en la tarea activa elegida.
4. **`project/02_architecture/system_overview.md`** → Entender dónde ensambla ese módulo dentro del sistema general.
5. **`project/03_engineering/tech_stack.yaml`** → Conocer el límite técnico antes de generar o modificar código.
6. *(Opcional)* **`project/04_adrs/`** y **`project/01_product/vision.md`** → Consultar historial de decisiones o visión de producto solo ante bloqueos o dudas direccionales durante el desarrollo.

---

## Protocolo de Mantenimiento

1. **No crear archivos fuera de la estructura definida.** Todo archivo nuevo debe ubicarse en el directorio correspondiente de `project/` según su naturaleza (producto, arquitectura, ingeniería o ADR).
2. **No modificar la estructura de directorios** sin registrar un ADR que justifique el cambio.
3. **Nuevos módulos de dominio** deben crearse a partir del template `standard/templates/domain_module.md`, siguiendo la estructura definida en `standard/guide_domain_modules.md`, completando todas las secciones obligatorias.
4. **Todo ADR aceptado** que modifique un estándar técnico **debe** reflejarse actualizando el archivo correspondiente en `project/03_engineering/`.
5. **Al agregar o eliminar archivos**, actualizar la Tabla de Contenidos de este archivo.
6. **Las secciones marcadas como [OBLIGATORIO]** no pueden eliminarse ni dejarse vacías.
7. **Todo documento nuevo** debe incluir el frontmatter YAML correspondiente a su tipo (ver sección siguiente).

---

## Convenciones de Frontmatter

Todo documento markdown del estándar debe incluir un bloque de **YAML frontmatter** al inicio del archivo. El frontmatter permite a los agentes de IA obtener metadata clave de un documento sin necesidad de parsear su contenido completo.

### Campos comunes (todos los documentos)

| Campo | Tipo | Descripción |
|---|---|---|
| `type` | **[OBLIGATORIO]** | Identificador del tipo de documento. |
| `version` | **[OBLIGATORIO]** | Versión del documento (ej: `1.0`). |
| `last_updated` | **[OBLIGATORIO]** | Fecha de última actualización en formato `YYYY-MM-DD`. |

### Campo `state` (documentos de trabajo)

Aplica a: `domain_modules`, documentos de `project/02_architecture/` y documentos de `project/03_engineering/`. **No aplica** a `vision.md`, `roadmap.md` ni a ADRs (que tienen su propio `status`).

| Valor | Significado | Implicación para el agente |
|---|---|---|
| `pending` | Definido pero no implementado | Puede trabajar en este documento/implementación |
| `doing` | Alguien está trabajando en esto | **No tocar** sin coordinación previa |
| `done` | Completado y operativo | **No modificar** sin justificación (ADR o indicación explícita) |
| `deprecated` | Ya no vigente | Ignorar para nuevas implementaciones |

> **Importante:** Estos son los **únicos valores permitidos** para el campo `state`. No usar valores alternativos.

### Esquemas específicos por tipo

Cada archivo `guide_*.md` en `standard/` define el esquema de frontmatter completo para los archivos de proyecto que cubre, incluyendo los campos específicos que aplican a ese tipo de documento.

---

## Principios del Estándar

1. **Modularidad (PRD Modular)**: Los requerimientos funcionales no son una lista centralizada, sino que viven dentro de su módulo de dominio correspondiente (`domain_modules/`). Cada módulo es un mini-PRD.
2. **Autodescripción**: Cada área del estándar tiene un `guide_*.md` que explica qué archivos contiene, cómo crearlos y cómo mantenerlos, y un `agent_*.md` con reglas operativas para agentes.
3. **Escritura Orientada a Resultados**: Se evitan listas rígidas de "El sistema debe...". Se usan **User Stories** para el valor de negocio y **Criterios de Aceptación (AC)** para la validación.
4. **Design Docs**: La carpeta `project/02_architecture/` actúa como el repositorio de Design Docs, donde se describe la solución técnica a los requerimientos definidos en el nivel de producto.
5. **Contexto Mínimo Suficiente**: La documentación está estructurada para que un Agente de IA pueda leer solo lo necesario para realizar una tarea específica sin saturar su contexto.
6. **Trazabilidad**: Las decisiones arquitectónicas (ADRs) se reflejan en la ingeniería (`project/03_engineering/`) cuando modifican estándares técnicos.
7. **Documentación como Código**: Los archivos de documentación viven junto al código fuente, se versionan con Git y se mantienen como parte del flujo de desarrollo.

---

## Convenciones

<!-- [OBLIGATORIO] Idioma elegido, formato de fechas, estilo de escritura. -->

| Convención | Valor |
|---|---|
| Idioma de documentación | *A definir por el equipo del proyecto* |
| Formato de fechas | `YYYY-MM-DD` |
| Estilo de escritura | Claro, orientado a resultados, legible por humanos y agentes de IA |

---

## Historial de Versiones

<!-- [OBLIGATORIO] Registro estructurado de cambios del estándar. -->

Ver [changelog.yaml](./changelog.yaml) para el registro completo de versiones.
