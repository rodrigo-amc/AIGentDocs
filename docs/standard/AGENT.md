# Instrucciones Operativas para Agentes de IA

Eres un agente de IA trabajando en un proyecto de software documentado bajo este estándar.
Este archivo define tus reglas de comportamiento global. Debes seguirlas en todo momento.

---

## Modo de Trabajo

Antes de actuar, identifica en qué modo estás trabajando según la indicación del usuario o la naturaleza de la tarea:

### Modo Onboarding (Documentación Inicial)

- **Aplica cuando llegas a un proyecto existente cuya documentación está incompleta o vacía** (los archivos de contenido contienen placeholders sin llenar).
- Tu objetivo es **analizar el código fuente del proyecto y completar la documentación** como borrador para revisión humana.
- Sigue el orden de adopción para **Proyecto Existente (Brownfield)** definido en `README.md`:
  1. Analizar el código → Llenar `project/03_engineering/tech_stack.yaml`.
  2. Diagramar la arquitectura existente → Completar `project/02_architecture/`.
  3. Documentar el producto → Completar `project/01_product/vision.md` y `domain_modules/`.
  4. Planificar el futuro → Configurar `project/01_product/roadmap.md` con las tareas pendientes.
  5. Registrar decisiones → Crear ADRs retroactivos en `project/04_adrs/`.
- **Presenta cada documento completado al usuario para su revisión** antes de marcarlo como definitivo.
- Una vez la documentación esté completa y aprobada, la próxima sesión comenzará en Modo Diseño o Modo Implementación según corresponda.

### Modo Diseño (Documentación)

- Aplica cuando se están creando o editando documentos en `project/`.
- **No generes código fuente** en este modo. Tu foco es completar, corregir o estructurar la documentación del proyecto.
- Asegúrate de que todo documento nuevo cumpla con el frontmatter y las secciones obligatorias definidas en el `guide_*.md` correspondiente en `standard/`.

### Modo Implementación (Código)

- Aplica cuando se está escribiendo o modificando código fuente del proyecto.
- La documentación en `project/` es tu **fuente de verdad**. Léela antes de generar código, pero no la modifiques salvo para actualizar estados (`state` en frontmatter, tablero en `roadmap.md`).
- Todo código que generes debe respetar las reglas definidas en `project/03_engineering/`.

> Si no tienes claro en qué modo trabajar, pregunta al usuario antes de proceder.

---

## Protocolo de Entrada al Proyecto

Cuando inicies una nueva sesión o recibas una tarea, sigue este orden:

1. Lee `standard/README.md` para entender la estructura general del proyecto.
2. **Evalúa el estado de la documentación:**
   - Si los archivos de contenido en `project/` (`vision.md`, `tech_stack.yaml`, etc.) están vacíos o con placeholders → **Modo Onboarding**.
   - Si la documentación está completa → Sigue el **Protocolo de Lectura** definido en `README.md`.
3. Antes de trabajar en cualquier área del proyecto, lee el archivo `agent_*.md` correspondiente en `standard/`. Contiene instrucciones específicas para ese contexto.

---

## Gestión de Sesiones

La documentación de un proyecto no puede completarse en una única sesión de agente. Para evitar la saturación de la ventana de contexto y mantener la coherencia, el trabajo se organiza en **sesiones independientes y enfocadas**, cada una con un alcance de escritura definido.

> **Principio clave:** La sesión define tu **alcance de escritura**: qué archivos y directorios podés crear o modificar. **No limita tu capacidad de lectura** — el Protocolo de Lectura de `README.md` aplica en su totalidad, independientemente de la sesión activa.

Al iniciar una sesión, el usuario te indicará en qué parte de la documentación van a trabajar. Esa indicación define tu alcance. Si el usuario no especifica una sesión, presentale la **Tabla de Referencia Rápida** de esta sección y solicitale que elija una antes de proceder.

### Regla de Guardia de Sesión

**Si durante la sesión el usuario te solicita crear o modificar un documento que, según la tabla de sesiones, pertenece a otra sesión, debes:**

1. **Detenerte.** No inicies el trabajo solicitado.
2. **Informar al usuario** que el trabajo solicitado corresponde a otra sesión según esta guía.
3. **Recomendar** que se abra una nueva sesión enfocada en esa área.
4. **Esperar instrucción explícita** del usuario antes de proceder. Si el usuario decide continuar de todas formas, respeta su decisión.

**Si la instrucción del usuario es ambigua, contradictoria con esta guía, o no podés determinar a qué sesión corresponde el trabajo solicitado, debes:**

1. **Detenerte.** No asumas una interpretación.
2. **Explicar al usuario** cuál es la duda, ambigüedad o contradicción que detectás.
3. **Esperar instrucción explícita** antes de continuar.

#### Excepción: Propagación de ADR

La sesión `04_adrs` es la única que permite modificar archivos fuera de su propio directorio. Si un ADR aceptado afecta un estándar técnico, el agente **debe** actualizar el archivo correspondiente en `project/03_engineering/` dentro de la misma sesión. Esta es una excepción intencional y necesaria para mantener la trazabilidad definida en las Reglas Globales.

#### Excepción: Trazabilidad Global

Para cumplir con las **Reglas Globales de Trazabilidad**, toda sesión tiene permiso concurrente de escritura para modificar metadatos de estado. Esto significa que el agente **debe** actualizar los estados de sus tareas en `project/01_product/roadmap.md` y el campo `state` en el frontmatter de los documentos de `project/01_product/domain_modules/` al completar un avance, sin importar el tipo de sesión activa.

### Tipos de Sesión

Cada tipo de sesión tiene un **objetivo único**, un **alcance de escritura delimitado** y una **frecuencia** esperada.

#### Sesión: `01_product`

**Objetivo:** Establecer la identidad del producto, su alcance, la hoja de ruta inicial y los atributos de calidad base.

| Entregable | Directorio |
|---|---|
| `vision.md` | `project/01_product/` |
| `roadmap.md` | `project/01_product/` |
| `quality_attributes.md` | `project/01_product/` |

**Alcance de escritura:** Solo documentos estratégicos de producto. No se crean módulos de dominio, ni documentos de arquitectura, ni de ingeniería en esta sesión.

**Frecuencia:** Una única vez al inicio del proyecto.

---

#### Sesión: `01_product_domain_modules`

**Objetivo:** Definir las User Stories, Criterios de Aceptación y Reglas de Negocio de **un único módulo de dominio**.

| Entregable | Directorio |
|---|---|
| Un archivo `[module_name].md` | `project/01_product/domain_modules/` |

**Alcance de escritura:** Se trabaja exclusivamente en un solo módulo por sesión. Si el módulo tiene dependencias con otros módulos ya aprobados (campo `depends_on` del frontmatter), el agente debe leerlos como referencia, pero **no modificarlos**.

**Frecuencia:** Una sesión por cada módulo del Roadmap.

> **Importante:** Si durante la definición de un módulo se detectan nuevos NFRs o reglas de negocio que afectan a `quality_attributes.md` o a módulos ya aprobados, el agente debe **registrar la observación** y comunicarla al usuario, pero no debe modificar esos documentos en esta sesión.

---

#### Sesión: `02_architecture`

**Objetivo:** Diseñar la solución técnica que responde a los requerimientos funcionales ya definidos en los módulos de dominio.

| Entregable | Directorio |
|---|---|
| `system_overview.md` | `project/02_architecture/` |
| `data_flow.md` | `project/02_architecture/` |
| `infrastructure.md` | `project/02_architecture/` |

**Alcance de escritura:** Solo documentos de arquitectura. No se modifican módulos de dominio ni documentos de ingeniería.

**Frecuencia:** Una vez, después de aprobar todos los módulos de dominio de la fase actual del Roadmap.

---

#### Sesión: `03_engineering`

**Objetivo:** Definir las reglas técnicas concretas del proyecto: stack tecnológico, estrategia de testing y guías de API.

| Entregable | Directorio |
|---|---|
| `tech_stack.yaml` | `project/03_engineering/` |
| `testing_strategy.md` | `project/03_engineering/` |
| `api_guidelines.md` *(condicional)* | `project/03_engineering/` |

**Alcance de escritura:** Solo documentos de ingeniería. Cada tecnología definida en `tech_stack.yaml` debe tener un ADR asociado; si no existe, el agente debe señalarlo pero **no crear el ADR en esta sesión** (corresponde a una sesión `04_adrs`).

**Frecuencia:** Una vez, después de aprobar la arquitectura.

---

#### Sesión: `04_adrs`

**Objetivo:** Registrar **una única decisión arquitectónica** significativa.

| Entregable | Directorio |
|---|---|
| Un archivo `[NNNN]-[titulo].md` | `project/04_adrs/` |

**Alcance de escritura:** Crear el ADR y, si aplica la **Propagación de ADR**, actualizar el documento afectado en `project/03_engineering/`. No se modifican módulos de dominio ni documentos de arquitectura.

**Frecuencia:** Bajo demanda, cada vez que surja una decisión técnica relevante. Puede ejecutarse en cualquier momento del proyecto.

### Orden Recomendado de Ejecución

```text
01_product
    ↓
01_product_domain_modules × N (un módulo por sesión)
    ↓
02_architecture
    ↓
03_engineering

04_adrs → puede ejecutarse en cualquier momento, de forma independiente.
```

### Tabla de Referencia Rápida

| Sesión | ¿Qué se crea/modifica? | ¿Dónde? | ¿Cuándo? | ¿Cuántas veces? |
|---|---|---|---|---|
| `01_product` | `vision.md`, `roadmap.md`, `quality_attributes.md` | `project/01_product/` | Al inicio del proyecto | 1 |
| `01_product_domain_modules` | Un `[module_name].md` | `project/01_product/domain_modules/` | Después de `01_product` | 1 por módulo |
| `02_architecture` | `system_overview.md`, `data_flow.md`, `infrastructure.md` | `project/02_architecture/` | Después de aprobar módulos | 1 |
| `03_engineering` | `tech_stack.yaml`, `testing_strategy.md`, `api_guidelines.md` | `project/03_engineering/` | Después de aprobar arquitectura | 1 |
| `04_adrs` | Un `[NNNN]-[titulo].md` + Propagación | `project/04_adrs/` + `project/03_engineering/` | Cuando surja una decisión | Bajo demanda |

---

## Reglas Globales

### Documentación

- **No crees archivos fuera de la estructura definida en `README.md`.**
- **No modifiques la estructura de directorios** sin registrar un ADR en `project/04_adrs/`.
- Todo documento nuevo debe incluir el **frontmatter YAML** correspondiente a su tipo, según el `guide_*.md` del área correspondiente en `standard/`.
- Las secciones marcadas como **[OBLIGATORIO]** no pueden eliminarse ni dejarse vacías.
- Al agregar o eliminar archivos de documentación, actualiza la Tabla de Contenidos en `standard/README.md`.

### Código Fuente

- **Antes de generar código**, lee `project/03_engineering/tech_stack.yaml`. No utilices tecnologías, versiones o librerías que no estén listadas allí.
- **No instales ni propongas nuevas dependencias sin discutirlo con el desarrollador humano.** La incorporación de dependencias es una decisión estructural que impacta el diseño, la infraestructura de despliegue y las licencias del proyecto. El agente puede sugerir, pero la decisión y el registro del ADR correspondiente deben ser aprobados por el equipo humano.
- Cuando trabajes en un módulo de dominio, consulta el campo `code_paths` de su frontmatter para saber qué archivos o directorios de código le corresponden.

### Trazabilidad

- Cuando completes una User Story o tarea del `roadmap.md`, actualiza su estado en el tablero (muévela a `[Done]`).
- **Sincronización de Estados**: Existe un estado global en el frontmatter de cada módulo de dominio (`state`). Cada vez que muevas una tarea en el Kanban de `project/01_product/roadmap.md` a `[In Progress]` o a `[Done]`, estás **OBLIGADO** a abrir el módulo de dominio afectado y actualizar su `state` para que refleje la realidad actual:
  - Si al menos una US del módulo está en proceso → `state: doing`.
  - Si todas las US planificadas están completadas → `state: done`.

---

## Restricciones

- **No asumas información que no esté documentada.** Si necesitas un dato que no encuentras en la documentación del proyecto (`project/`), pregunta al usuario antes de proceder.
- **No modifiques documentos con estado `done`** sin una justificación explícita (ADR o indicación directa del usuario).
- **No modifiques documentos con estado `doing`** sin coordinación previa con el usuario.

---

## Verificación antes de Finalizar

Antes de dar por terminada cualquier tarea, verifica:

- [ ] ¿El código generado respeta `tech_stack.yaml`?
- [ ] ¿Los documentos nuevos o modificados tienen frontmatter válido?
- [ ] ¿El `roadmap.md` refleja el avance realizado?
- [ ] ¿Las secciones `[OBLIGATORIO]` de los documentos tocados están completas?
- [ ] ¿Los archivos o directorios nuevos de código están registrados en el `code_paths` del módulo de dominio correspondiente?
