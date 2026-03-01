---
type: agent_instructions
scope: architecture
version: 1.2
last_updated: 2026-03-01
sessions: ["02_architecture"]
reads: "guide_architecture.md"
project_path: "project/02_architecture/"
---

# Instrucciones para Agentes — Contexto de Arquitectura

Este archivo contiene las reglas operativas específicas para trabajar dentro de `project/02_architecture/`.
Antes de leer este archivo, asegúrate de haber leído el `AGENT.md` global en `standard/`.

---

## Propósito de este directorio

Aquí se define el **"Qué"** del sistema: la solución técnica que responde a los requerimientos de `01_product/`. Los documentos de este directorio son **Design Docs** que describen la arquitectura, los flujos de datos y la infraestructura.

---

## Reglas Operativas

### system_overview.md

- Este archivo contiene los diagramas C4 (Contexto y Contenedores) y la descripción de los patrones arquitectónicos del proyecto. **Léelo antes de generar código** para entender cómo está organizado el sistema.
- Si necesitas agregar un nuevo contenedor o componente al sistema, actualiza los diagramas correspondientes y discútelo con el usuario antes de implementar.

### data_flow.md

- Documenta los flujos de datos entre módulos y los diagramas de secuencia. Cuando un proceso cruzado involucra múltiples módulos de dominio (Responsabilidad Modularizada), **la visión global del flujo debe estar aquí**, no fragmentada en los módulos individuales.
- Al crear o modificar un flujo, verifica que las referencias a User Stories de `01_product/domain_modules/` sean correctas y estén actualizadas.
- Usa diagramas Mermaid para representar los flujos. Prioriza diagramas sobre texto extenso.

### infrastructure.md

- Define el entorno de despliegue (cloud, on-premise, híbrido), la topología de red, el pipeline de CI/CD y las variables de entorno necesarias.
- **No modifiques decisiones de infraestructura sin un ADR aprobado** en `04_adrs/`. Los cambios en infraestructura impactan costos, seguridad y disponibilidad.

---

## Relación con otros directorios

- Los requerimientos que aquí se diseñan provienen de `01_product/`. No inventes soluciones técnicas para problemas que no estén documentados como User Stories.
- Las decisiones arquitectónicas significativas deben tener un ADR correspondiente en `04_adrs/`.
- Las tecnologías que utilices deben estar registradas en `03_engineering/tech_stack.yaml`.

---

## Convenciones para Diagramas Mermaid

Los diagramas en este directorio deben crearse usando **Mermaid** (texto plano dentro de bloques de código markdown). Esto permite que se versionen con Git, se rendericen en GitHub/GitLab y que los agentes de IA puedan leerlos y generarlos directamente.

### Tipo de diagrama por contexto

| Contexto | Tipo Mermaid | Archivo destino |
|---|---|---|
| Sistema ↔ actores externos (C4 Nivel 1) | `graph` o `flowchart` | `02_architecture/system_overview.md` |
| Contenedores internos (C4 Nivel 2) | `graph` o `flowchart` | `02_architecture/system_overview.md` |
| Flujos de datos y procesos cruzados | `sequenceDiagram` | `02_architecture/data_flow.md` |
| Modelo de datos / Entidades | `erDiagram` | `02_architecture/data_flow.md` |
| Ciclo de vida de una entidad | `stateDiagram-v2` | `01_product/domain_modules/[modulo].md` |
| Pipeline de despliegue | `graph` | `02_architecture/infrastructure.md` |

### Reglas de estilo

- **Naming de nodos:** Usar nombres descriptivos en español, sin abreviaturas crípticas. Ej: `ServidorWeb` en lugar de `SW`, `BaseDeDatos` en lugar de `DB`.
- **Etiquetas de relaciones:** Toda flecha entre nodos debe tener una etiqueta que describa la interacción. Ej: `-->|"Consulta SQL"|` en lugar de `-->`.
- **Nivel de detalle:** Los diagramas deben ser comprensibles sin necesidad de leer texto adicional. Si un diagrama requiere más de 15-20 nodos, considerar dividirlo en subdiagramas.
- **Formato del bloque:** Usar siempre el bloque de código con lenguaje `mermaid`:

  ````
  ```mermaid
  graph LR
      Usuario -->|"HTTP Request"| ServidorWeb
      ServidorWeb -->|"Query"| BaseDeDatos
  ```
  ````

