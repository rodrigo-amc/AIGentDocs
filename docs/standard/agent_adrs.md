---
type: agent_instructions
scope: adrs
version: 1.2
last_updated: 2026-03-01
sessions: ["04_adrs"]
reads: "guide_adrs.md"
project_path: "project/04_adrs/"
---

# Instrucciones para Agentes — Contexto de ADRs

Este archivo contiene las reglas operativas específicas para trabajar con ADRs en `project/04_adrs/`.
Antes de leer este archivo, asegúrate de haber leído el `AGENT.md` global en `standard/`.

---

## Propósito de este directorio

Aquí se registra el **"Por qué" histórico** de las decisiones arquitectónicas del proyecto. Los ADRs son documentos inmutables que explican el contexto, la decisión tomada y sus consecuencias.

---

## Reglas Operativas

### Creación de ADRs

- Sigue estrictamente la estructura definida en `guide_adrs.md`: frontmatter YAML, encabezado, Contexto y Problema, Decisión, y Consecuencias.
- La numeración es **secuencial**. Antes de crear un nuevo ADR, verifica cuál es el último número existente y usa el siguiente.
- Todo ADR nuevo debe crearse con estado `proposed` hasta que el usuario lo apruebe.
- **No crees un ADR por iniciativa propia.** La necesidad de registrar una decisión arquitectónica debe surgir de una discusión con el desarrollador humano o como resultado de una tarea que lo requiera.

### Inmutabilidad

- **Los ADRs son inmutables.** Una vez aceptados o rechazados, no se modifican.
- Para cambiar una decisión previa, crea un **nuevo ADR** que referencie al anterior mediante los campos `supersedes` y `superseded_by` del frontmatter.

### Impacto en Ingeniería

- Todo ADR con estado **Aceptado** que modifique un estándar técnico **debe** reflejarse actualizando el archivo correspondiente en `03_engineering/`.
- Si un ADR aprueba una nueva tecnología, actualiza `03_engineering/tech_stack.yaml` con la nueva entrada.

### Consulta

- Antes de proponer una solución técnica que contradiga una práctica existente, **verifica si hay un ADR vigente** que la respalde. Si lo hay, no la contradígas sin crear un nuevo ADR que justifique el cambio.
