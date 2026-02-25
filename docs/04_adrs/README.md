# 04_adrs — Architecture Decision Records

Este directorio contiene el registro inmutable de decisiones arquitectónicas significativas del proyecto. Sigue el estándar de la industria (AWS/Google) para explicar el **Contexto**, la **Decisión** tomada y sus **Consecuencias**.

Los ADRs evitan que se re-discutan decisiones pasadas y explican el "por qué" de la evolución del proyecto.

---

## Reglas de Uso

1. El **contenido (Markdown)** de los ADRs es inmutable: una vez aceptados o rechazados, no se modifican.
2. El **frontmatter (YAML)** de un ADR **sí puede actualizarse** exclusivamente para reflejar cambios de estado (`status: superseded`) y trazabilidad (`superseded_by: [ID]`).
3. Para cambiar una decisión, se crea un **nuevo ADR** con estado `Reemplazado` que referencia al anterior en su contexto, y se actualiza el frontmatter del ADR viejo.
4. La numeración es **secuencial**: 0001, 0002, 0003...
5. Todo ADR con estado **Aceptado** que modifique un estándar técnico **debe** reflejarse actualizando el archivo correspondiente en `03_engineering/`.

---

## Cómo crear un nuevo ADR

1. Crear un nuevo archivo `.md` en este directorio con el formato de nombre: `NNNN-titulo-en-minusculas.md` (ej: `0002-usar-postgresql-como-base-de-datos.md`).
2. Escribir el contenido siguiendo la estructura definida en la sección **"Estructura de un ADR"** de este documento.
3. Completar todas las secciones **[OBLIGATORIO]**.
4. Establecer el estado como `Propuesto` hasta que sea revisado y aprobado.
5. Actualizar la Tabla de Contenidos en `docs/README.md`.

## Cómo registrar el reemplazo de una decisión

1. Crear un nuevo ADR siguiendo los pasos anteriores.
2. En el nuevo ADR, referenciar al ADR que se está reemplazando en la sección de Contexto y en el campo `supersedes` del frontmatter.
3. Abrir el ADR viejo y **actualizar su frontmatter**: cambiar `status: superseded` y completar `superseded_by: [ID del nuevo ADR]`.
4. **No modificar bajo ningún concepto el contenido (Markdown)** del ADR original.
5. Si la decisión afecta un estándar técnico, actualizar el archivo correspondiente en `03_engineering/`.

---

## Estructura de un ADR

Todo archivo ADR debe contener las siguientes secciones, en este orden:

### Frontmatter

```yaml
---
type: adr
id: 0                    # Número secuencial del ADR
version: 1.0
last_updated: YYYY-MM-DD
status: proposed         # proposed | accepted | rejected | superseded
date: YYYY-MM-DD         # Fecha de la decisión
decision_makers: []      # Lista de decisores (ej: [Juan, María])
supersedes: null         # ID del ADR que reemplaza (si aplica)
superseded_by: null      # ID del ADR que lo reemplazó (si aplica)
---
```

### Encabezado

```markdown
# [NNNN] - [Título Corto en Presente Indicativo]
```

### Secciones del ADR

| Sección | Tipo | Descripción |
|---|---|---|
| Contexto y Problema | **[OBLIGATORIO]** | Qué problema, restricción o necesidad nos obliga a tomar una decisión. Incluir alternativas consideradas. |
| Decisión | **[OBLIGATORIO]** | Qué se decidió y por qué. Ser específico tecnológicamente. |
| Consecuencias | **[OBLIGATORIO]** | Positivas, negativas y riesgos derivados de la decisión. |
| Cumplimiento | **[OPCIONAL]** | Cómo se verifica que la decisión se respeta (ej: tests automáticos, code review, linter rules). |

### Formato de Consecuencias

Las consecuencias deben organizarse en tres categorías:

```markdown
## Consecuencias

### Positivas
- [consecuencia positiva]

### Negativas
- [consecuencia negativa]

### Riesgos
- [riesgo identificado]
```

---

## ADR Inicial: `0001-record-architecture-decisions.md`

Es el primer ADR de todo proyecto. Documenta la decisión de adoptar ADRs. Su contenido base es:

- **Contexto:** "Necesitamos un mecanismo formal para registrar decisiones arquitectónicas significativas y sus razones, de modo que cualquier miembro del equipo (humano o agente de IA) pueda entender la evolución del proyecto."
- **Decisión:** "Usaremos Architecture Decision Records (ADRs) almacenados en `docs/04_adrs/`, siguiendo la estructura definida en este README."
- **Consecuencias:** "Todas las decisiones arquitectónicas serán trazables. Se requiere disciplina para crear un ADR ante cada decisión significativa."
