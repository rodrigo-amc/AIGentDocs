# Estándar de Documentación para Ingeniería de Software Aumentada por IA

Este repositorio contiene un **framework de documentación como código** diseñado para que agentes de IA puedan entender, documentar y desarrollar proyectos de software de forma eficiente. Se puede adoptar tanto en proyectos nuevos como en proyectos existentes.

---

## Tabla de Contenidos

<!-- [OBLIGATORIO] Índice completo con rutas relativas a cada archivo de /docs. Debe mantenerse actualizado. -->

### Raíz

- [README.md](./README.md) — Este archivo (punto de entrada)
- [AGENT.md](./AGENT.md) — Instrucciones operativas globales para agentes de IA
- [AGENT_REVIEW.md](./AGENT_REVIEW.md) — Prompt de auditoría de documentación
- [QUICKSTART.md](./QUICKSTART.md) — Guía de uso del framework
- [changelog.yaml](./changelog.yaml) — Historial de versiones del estándar

### 01_product — Contexto de Producto

- [README.md](./01_product/README.md) — Instrucciones para los archivos de producto
- [AGENT.md](./01_product/AGENT.md) — Instrucciones operativas para agentes en este contexto
- [vision.md](./01_product/vision.md) — Visión del producto, Elevator Pitch y Alcance
- [roadmap.md](./01_product/roadmap.md) — Estado actual del proyecto, hitos y futuro
- [quality_attributes.md](./01_product/quality_attributes.md) — Requerimientos No Funcionales
- [domain_modules/README.md](./01_product/domain_modules/README.md) — Instrucciones para módulos de dominio

### 02_architecture — Arquitectura del Sistema

- [README.md](./02_architecture/README.md) — Instrucciones para los Design Docs
- [AGENT.md](./02_architecture/AGENT.md) — Instrucciones operativas para agentes en este contexto
- [system_overview.md](./02_architecture/system_overview.md) — Diagramas C4, estructura de carpetas y patrones
- [data_flow.md](./02_architecture/data_flow.md) — Flujos de datos y modelo de datos
- [infrastructure.md](./02_architecture/infrastructure.md) — Topología, despliegue y CI/CD

### 03_engineering — Ingeniería

- [README.md](./03_engineering/README.md) — Instrucciones y regla de interacción ADR → Engineering
- [AGENT.md](./03_engineering/AGENT.md) — Instrucciones operativas para agentes en este contexto
- [tech_stack.yaml](./03_engineering/tech_stack.yaml) — Stack tecnológico exacto (YAML)
- [testing_strategy.md](./03_engineering/testing_strategy.md) — Estrategia de pruebas y cobertura

### 04_adrs — Architecture Decision Records

- [README.md](./04_adrs/README.md) — Instrucciones, estructura y guía de creación de ADRs
- [AGENT.md](./04_adrs/AGENT.md) — Instrucciones operativas para agentes en este contexto
- [0001-registrar-decisiones-de-arquitectura.md](./04_adrs/0001-registrar-decisiones-de-arquitectura.md) — Adopción de ADRs

---

## Filosofía del Estándar

Este estándar está **diseñado para ser consumido por agentes de IA** como audiencia principal. La estructura de directorios, la modularización de los documentos y los protocolos de lectura están optimizados para que un agente pueda entender el contexto de un proyecto de software de forma eficiente, minimizando el uso de ventana de contexto y tokens.

Todos los documentos deben mantener un **formato legible por humanos** — los humanos son quienes crean, revisan y aprueban el contenido. Sin embargo, las decisiones de diseño del estándar (qué documentar, dónde ubicarlo, cómo estructurarlo y cómo navegarlo) priorizan la interacción con agentes de IA.

> **Nota sobre el idioma:** El idioma de la documentación queda a consideración del equipo de desarrollo de cada proyecto.

---

## Estructura de Directorios

```text
/docs
├── README.md                  # Este archivo (punto de entrada)
├── AGENT.md                   # Instrucciones operativas globales para agentes de IA y gestión de sesiones
├── AGENT_REVIEW.md            # Prompt de auditoría de documentación (bajo demanda)
├── QUICKSTART.md              # Guía de uso del framework
├── changelog.yaml             # Historial de versiones del estándar
├── 01_product/                # El "Por qué" y el Negocio
│   ├── README.md              # Instrucciones para vision.md, roadmap.md y quality_attributes.md
│   ├── AGENT.md               # Instrucciones operativas para agentes en este contexto
│   ├── vision.md              # Visión del producto, Elevator Pitch, Alcance y Mapa de Entidades (DDD).
│   ├── roadmap.md             # Estado actual del proyecto, hitos y futuro.
│   ├── quality_attributes.md  # Requerimientos No Funcionales (Rendimiento, Seguridad, etc).
│   └── domain_modules/        # Requerimientos modularizados por entidad de dominio.
│       ├── README.md           # Instrucciones y estructura para crear módulos de dominio
│       └── [module_name].md   # Ej: clients.md, orders.md (Reglas, Atributos, Ciclo de vida).
│
├── 02_architecture/           # El "Qué" y la Estructura (Design Docs)
│   ├── README.md              # Instrucciones para system_overview, data_flow e infrastructure
│   ├── AGENT.md               # Instrucciones operativas para agentes en este contexto
│   ├── system_overview.md     # Diagramas de alto nivel (C4 Model), Contenedores.
│   ├── data_flow.md           # Flujos de datos críticos y diagramas de secuencia.
│   └── infrastructure.md      # Topología de nube, redes y despliegue.
│
├── 03_engineering/            # El "Cómo" y las Reglas Técnicas
│   ├── README.md              # Instrucciones + regla de interacción ADR → Engineering
│   ├── AGENT.md               # Instrucciones operativas para agentes en este contexto
│   ├── tech_stack.yaml        # Stack tecnológico exacto (YAML). Versiones, librerías y ADRs.
│   ├── testing_strategy.md    # Estrategia de pruebas, herramientas y cobertura esperada.
│   └── api_guidelines.md      # [CONDICIONAL] Solo si se exponen endpoints.
│
└── 04_adrs/                   # El "Histórico" de Decisiones (Architecture Decision Records)
    ├── README.md              # Instrucciones, estructura de ADR, reglas de uso y guía de creación
    ├── AGENT.md               # Instrucciones operativas para agentes en este contexto
    └── [NNNN]-[title].md      # Registros de decisiones individuales.
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

1. Completar `01_product/vision.md` → Definir qué se va a construir.
2. Crear los `domain_modules/` necesarios → Documentar User Stories y ACs.
3. Completar `01_product/roadmap.md` → Priorizar las tareas.
4. Diseñar `02_architecture/` → system_overview, data_flow, infrastructure.
5. Definir `03_engineering/tech_stack.yaml` → Elegir tecnologías (con ADRs).
6. Definir `03_engineering/testing_strategy.md` → Estrategia de tests.
7. Implementar el código siguiendo la documentación.

### Proyecto Existente (Brownfield)

Si el proyecto ya tiene código, documentar por **ingeniería inversa**. El orden es diferente — se parte de lo concreto (código) hacia lo abstracto (producto):

1. **`03_engineering/tech_stack.yaml`** → Analizar el código y registrar las tecnologías reales.
2. **`02_architecture/system_overview.md`** → Diagramar la arquitectura que ya existe.
3. **`02_architecture/infrastructure.md`** → Documentar dónde y cómo corre.
4. **`01_product/vision.md`** → Describir qué hace el producto y para quién.
5. **`01_product/domain_modules/`** → Identificar entidades del código y crear módulos con User Stories documentadas como ya implementadas (`state: done`).
6. **`01_product/roadmap.md`** → Usar el tablero para planificar lo que **falta**: nuevas features, refactors, bugs.
7. **`04_adrs/`** → Crear ADRs retroactivos (`status: accepted`) para las decisiones técnicas ya tomadas.

> **Tip:** Un agente de IA puede acelerar enormemente el paso de Brownfield. Puede analizar el código fuente y generar borradores de la documentación para revisión humana. Ver `AGENT.md` para el Modo Onboarding.

---

## Protocolo de Lectura

Orden en que un agente nuevo debe consumir la documentación para orientarse contextualmente con el menor costo de tokens:

1. **`AGENT.md`** (raíz de `docs/`) → Entender las reglas operativas globales.
2. **`01_product/roadmap.md`** → Identificar en qué hito/sprint estamos y tomar la tarea Activa (`[In Progress]`).
3. **`01_product/domain_modules/[modulo_afectado].md`** → Leer **SOLO** el módulo (o módulos) directamente mencionado(s) en la tarea activa elegida.
4. **`02_architecture/system_overview.md`** → Entender dónde ensambla ese módulo dentro del sistema general.
5. **`03_engineering/tech_stack.yaml`** → Conocer el límite técnico antes de generar o modificar código.
6. *(Opcional)* **`04_adrs/`** y **`01_product/vision.md`** → Consultar historial de decisiones o visión de producto solo ante bloqueos o dudas direccionales durante el desarrollo.

---

## Protocolo de Mantenimiento

1. **No crear archivos fuera de la estructura definida.** Todo archivo nuevo debe ubicarse en el directorio correspondiente según su naturaleza (producto, arquitectura, ingeniería o ADR).
2. **No modificar la estructura de directorios** sin registrar un ADR que justifique el cambio.
3. **Nuevos módulos de dominio** deben crearse siguiendo la estructura definida en `01_product/domain_modules/README.md`, completando todas las secciones obligatorias.
4. **Todo ADR aceptado** que modifique un estándar técnico **debe** reflejarse actualizando el archivo correspondiente en `03_engineering/`.
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

Aplica a: `domain_modules`, documentos de `02_architecture/` y documentos de `03_engineering/`. **No aplica** a `vision.md`, `roadmap.md` ni a ADRs (que tienen su propio `status`).

| Valor | Significado | Implicación para el agente |
|---|---|---|
| `pending` | Definido pero no implementado | Puede trabajar en este documento/implementación |
| `doing` | Alguien está trabajando en esto | **No tocar** sin coordinación previa |
| `done` | Completado y operativo | **No modificar** sin justificación (ADR o indicación explícita) |
| `deprecated` | Ya no vigente | Ignorar para nuevas implementaciones |

> **Importante:** Estos son los **únicos valores permitidos** para el campo `state`. No usar valores alternativos.

### Esquemas específicos por tipo

Cada directorio define en su `README.md` el esquema de frontmatter completo para sus archivos, incluyendo los campos específicos que aplican a ese tipo de documento.

---

## Principios del Estándar

1. **Modularidad (PRD Modular)**: Los requerimientos funcionales no son una lista centralizada, sino que viven dentro de su módulo de dominio correspondiente (`domain_modules/`). Cada módulo es un mini-PRD.
2. **Autodescripción**: Cada directorio tiene un `README.md` que explica qué archivos contiene, cómo crearlos y cómo mantenerlos.
3. **Escritura Orientada a Resultados**: Se evitan listas rígidas de "El sistema debe...". Se usan **User Stories** para el valor de negocio y **Criterios de Aceptación (AC)** para la validación.
4. **Design Docs**: La carpeta `02_architecture/` actúa como el repositorio de Design Docs, donde se describe la solución técnica a los requerimientos definidos en el nivel de producto.
5. **Contexto Mínimo Suficiente**: La documentación está estructurada para que un Agente de IA pueda leer solo lo necesario para realizar una tarea específica sin saturar su contexto.
6. **Trazabilidad**: Las decisiones arquitectónicas (ADRs) se reflejan en la ingeniería (`03_engineering/`) cuando modifican estándares técnicos.
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
