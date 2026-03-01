# Guía de Uso — Framework de Documentación como Código

Esta guía explica cómo adoptar este framework en un proyecto de software, cómo trabajar con él, y cómo aprovecharlo para potenciar el desarrollo con agentes de IA.

---

## ¿Qué es este framework?

Es un **estándar de documentación como código** que estructura la documentación de un proyecto de software en 4 capas:

| Capa | Directorio | Pregunta que responde |
|---|---|---|
| **Producto** | `01_product/` | ¿**Por qué** existe este software? ¿Qué hace? |
| **Arquitectura** | `02_architecture/` | ¿**Qué** se construyó? ¿Cómo se conecta todo? |
| **Ingeniería** | `03_engineering/` | ¿**Cómo** se construye? ¿Qué reglas técnicas aplican? |
| **Decisiones** | `04_adrs/` | ¿**Por qué** se tomaron estas decisiones? |

Cada capa tiene un `README.md` (qué contiene y cómo llenarla) y un `AGENT.md` (instrucciones para agentes de IA).

---

## Instalación

### 1. Copiar la carpeta `docs/` al repositorio

```bash
# Desde la raíz de tu proyecto
cp -r /ruta/al/framework/docs ./docs
```

O simplemente copia la carpeta `docs/` completa a la raíz de tu repositorio. La estructura incluye `docs/standard/` (el framework) y `docs/project/` (donde vivirá la documentación de tu proyecto).

### 2. Personalizar el README

Abrir `docs/standard/README.md` y reemplazar:

- El título `# Estándar de Documentación...` → `# [Nombre de tu proyecto]`
- La descripción genérica → Una descripción de tu proyecto en 1-2 líneas

### 3. Configurar las convenciones

En la sección **Convenciones** de `docs/standard/README.md`, definir:

- **Idioma de documentación**: español, inglés, etc.

### 4. Commitear

```bash
git add docs/
git commit -m "docs: adoptar framework de documentación como código"
```

---

## Cómo llenar la documentación

### Opción A: Manualmente (Modo Diseño)

Ir archivo por archivo siguiendo la estructura de cada template. Los comentarios HTML (`<!-- -->`) dentro de cada archivo explican qué escribir en cada sección. El orden recomendado depende del tipo de proyecto:

- **Proyecto nuevo** → `vision.md` → `domain_modules/` → `roadmap.md` → `architecture/` → `engineering/`
- **Proyecto existente** → `tech_stack.yaml` → `architecture/` → `vision.md` → `domain_modules/` → `roadmap.md`

Los templates de referencia están en `standard/templates/`. El agente los usa como guía para crear archivos en `project/`.

Ver la sección **Guía de Adopción** en `standard/README.md` para el detalle completo.

### Opción B: Con un agente de IA (Modo Onboarding)

Este es el flujo diseñado para proyectos existentes. Indicarle al agente:

```
Analiza el código de este proyecto y completa la documentación siguiendo
el framework en docs/. Empieza por leer docs/standard/AGENT.md.
```

El agente:

1. Leerá `AGENT.md` y detectará que los docs están vacíos (placeholders).
2. Entrará automáticamente en **Modo Onboarding**.
3. Analizará el código fuente.
4. Generará borradores de cada documento para tu revisión.
5. Vos aprobás o ajustás cada documento.

> **Importante:** El agente genera, el humano aprueba. Nunca se da por definitivo un documento sin revisión.

---

## Flujo de trabajo diario

Una vez que la documentación está completa, el flujo de trabajo con un agente de IA es:

### Agregar una nueva feature

```
1. El humano o el agente agrega la User Story al domain_module correspondiente.
2. Se mueve la tarea a [In Progress] en roadmap.md.
3. El agente lee los docs relevantes (Protocolo de Lectura) y genera código.
4. Al terminar, se mueve la tarea a [Done] y se actualiza el state del módulo.
```

### Modificar la arquitectura

```
1. Se crea un ADR en 04_adrs/ justificando el cambio.
2. El humano aprueba el ADR (status: accepted).
3. Se actualizan los documentos afectados en 02_architecture/ y 03_engineering/.
4. Se implementa el cambio en el código.
```

### Agregar una nueva dependencia

```
1. Se discute con el desarrollador humano.
2. Se crea un ADR justificando la incorporación.
3. Se actualiza tech_stack.yaml con la nueva tecnología.
4. Se usa en el código.
```

---

## Estructura de archivos

### Archivos de instrucciones (no se llenan, solo se leen)

| Archivo | Propósito |
|---|---|
| `*/README.md` | *Ahora son `standard/guide_*.md`* — Explican estructura y formato de cada área |
| `*/AGENT.md` | *Ahora son `standard/agent_*.md`* — Instrucciones operativas para agentes |
| `AGENT_REVIEW.md` | Prompt para auditar la documentación bajo demanda |
| `QUICKSTART.md` | Esta guía |

### Archivos de contenido (se llenan por proyecto)

| Archivo | Propósito |
|---|---|
| `project/01_product/vision.md` | Visión del producto, usuarios, alcance |
| `project/01_product/roadmap.md` | Tablero Kanban con tareas |
| `project/01_product/quality_attributes.md` | Requerimientos no funcionales |
| `project/01_product/domain_modules/*.md` | Un archivo por entidad de dominio |
| `project/02_architecture/system_overview.md` | Diagrama C4 y patrones |
| `project/02_architecture/data_flow.md` | Flujos de datos y modelo ER |
| `project/02_architecture/infrastructure.md` | Despliegue, CI/CD, variables |
| `project/03_engineering/tech_stack.yaml` | Stack tecnológico exacto |
| `project/03_engineering/testing_strategy.md` | Estrategia de testing |
| `project/03_engineering/api_guidelines.md` | Guías de API *(condicional)* |
| `project/04_adrs/NNNN-titulo.md` | Decisiones arquitectónicas |

---

## Auditoría

Para verificar que la documentación cumple con el estándar, usa el prompt de auditoría:

```
Ejecuta la auditoría de documentación siguiendo las instrucciones de docs/standard/AGENT_REVIEW.md.
```

El agente revisará: estructura, frontmatter, secciones obligatorias, consistencia y calidad. El resultado es un reporte con severidades (🔴 Crítico, 🟡 Advertencia, 🟢 Sugerencia).

---

## Resumen de modos del agente

| Modo | Cuándo | Qué hace |
|---|---|---|
| **Onboarding** | Docs vacíos + proyecto existente | Analiza código → genera borradores de docs |
| **Diseño** | Creando/editando documentación | Escribe y estructura docs, no genera código |
| **Implementación** | Escribiendo código | Lee docs como fuente de verdad, genera código |

---

## Convenciones clave

- **Frontmatter YAML**: Todo archivo `.md` de contenido empieza con un bloque `---` que define metadata (`type`, `version`, `last_updated`, `state`).
- **Estados (`state`)**: `pending` → `doing` → `done` (o `deprecated`). Controlan qué puede modificar un agente.
- **ADRs inmutables**: Una vez aceptados, los ADRs no se modifican. Para cambiar una decisión, se crea uno nuevo.
- **Documentación como Código**: Los docs se versionan con Git, se revisan en PRs, y se mantienen como parte del flujo de desarrollo.
