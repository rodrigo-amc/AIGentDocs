# Estándar de Documentación para Ingeniería de Software Aumentada por IA

Este documento es el **punto de entrada** a la documentación del proyecto. Define la estructura oficial, los protocolos de lectura y mantenimiento, y sirve como índice maestro para desarrolladores y agentes de IA.

## Filosofía del Estándar

Este estándar está **diseñado para ser consumido por agentes de IA** como audiencia principal. La estructura de directorios, la modularización de los documentos y los protocolos de lectura están optimizados para que un agente pueda entender el contexto de un proyecto de software de forma eficiente, minimizando el uso de ventana de contexto y tokens.

Todos los documentos deben mantener un **formato legible por humanos** — los humanos son quienes crean, revisan y aprueban el contenido. Sin embargo, las decisiones de diseño del estándar (qué documentar, dónde ubicarlo, cómo estructurarlo y cómo navegarlo) priorizan la interacción con agentes de IA.

> **Nota sobre el idioma:** El idioma de la documentación queda a consideración del equipo de desarrollo de cada proyecto.

---

## Estructura de Directorios

```text
/docs
├── README.md                  # Este archivo (punto de entrada)
├── AGENT.md                   # Instrucciones operativas globales y gestión de sesiones
├── AGENT_REVIEW.md            # Prompt de auditoría de documentación (bajo demanda)
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
