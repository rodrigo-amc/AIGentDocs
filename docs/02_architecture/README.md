# 02_architecture — Arquitectura del Sistema (Design Docs)

Este directorio actúa como el repositorio de **Design Docs** técnicos del proyecto. Su función es describir el **"Cómo"** (la solución técnica) que responde a los requerimientos definidos en los PRD modulares de `01_product/`.

---

## El Rol del Design Doc en el Metaframework

1. **Solución Técnica**: El contenido aquí no repite las User Stories, sino que diseña la arquitectura, el modelo de datos y la infraestructura necesaria para implementarlas.
2. **Visión Global**: Cuando un proceso funcional involucra múltiples módulos (Responsabilidad Modularizada), este directorio proporciona la conexión mediante diagramas de secuencia Mermaid.
3. **Legibilidad IA**: Se priorizan los diagramas Mermaid sobre largos párrafos de texto técnico.

---

## Archivos de este directorio

### `system_overview.md` — Vista General del Sistema

Mapa de alto nivel de la arquitectura.

| Sección | Tipo | Descripción |
|---|---|---|
| Diagrama de Contexto (C4 Nivel 1) | **[OBLIGATORIO]** | El sistema ↔ actores externos. |
| Diagrama de Contenedores (C4 Nivel 2) | **[OBLIGATORIO]** | Aplicaciones, bases de datos y servicios. |
| Estructura de Carpetas | **[OBLIGATORIO]** | Explicación del propósito de las carpetas del código. |
| Patrones Arquitectónicos | **[OBLIGATORIO]** | MVC, Clean Architecture, etc. |

**Frontmatter esperado:**

```yaml
---
type: system_overview
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
---
```

---

### `data_flow.md` — Flujos de Datos y Visión Global

Documenta el movimiento de información y la orquestación entre módulos.

| Sección | Tipo | Descripción |
|---|---|---|
| Visión Global de Procesos | **[OBLIGATORIO]** | Diagramas Mermaid que unen User Stories de múltiples módulos. |
| Modelo de Datos | **[OBLIGATORIO]** | Entidades y relaciones (Mermaid erDiagram). |
| Mensajería/Eventos | **[OPCIONAL]** | Colas, Pub/Sub, Webhooks. |

**Frontmatter esperado:**

```yaml
---
type: data_flow
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
modules_covered: []  # Módulos que involucra (ej: [orders, clients, stock])
---
```

---

### `infrastructure.md` — Infraestructura y Despliegue

Documenta el entorno donde corre el sistema.

| Sección | Tipo | Descripción |
|---|---|---|
| Entorno | **[OBLIGATORIO]** | Cloud, On-premise, etc. |
| Diagrama de Despliegue | **[OBLIGATORIO]** | Topología de red y servidores. |
| CI/CD | **[OBLIGATORIO]** | Pipeline de despliegue. |
| Variables y Secretos | **[OBLIGATORIO]** | Lista de variables necesarias. |

**Frontmatter esperado:**

```yaml
---
type: infrastructure
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
environment: ""      # cloud | on-premise | hybrid
---
```
