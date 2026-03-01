---
type: standard_guide
scope: engineering
version: 1.2
last_updated: 2026-03-01
project_path: "project/03_engineering/"
required_files: [tech_stack.yaml, testing_strategy.md]
optional_files: [api_guidelines.md]
---

# 03_engineering — Ingeniería e Implementación

Este directorio define las reglas del juego técnico y los estándares de calidad. Actúa como "guardarrail" para evitar que los agentes utilicen librerías obsoletas, patrones de código no deseados o generen tests inconsistentes.

> **Regla de Interacción con ADRs:** Todo ADR con estado **Aceptado** que modifique un estándar técnico (stack, testing, API) **debe** reflejarse actualizando el archivo correspondiente en este directorio. El ADR registra el **"por qué" histórico**; este directorio mantiene el **"qué" vigente**. Ver `guide_adrs.md` para más detalle.

---

## Archivos de este directorio

### `tech_stack.yaml` — Stack Tecnológico

> **Excepción de formato:** Este es el único archivo del estándar que no usa formato markdown. Se utiliza YAML puro para máxima eficiencia de parseo por parte de agentes de IA. Un desarrollador puede leerlo directamente; un usuario no técnico puede pedir al agente que le describa su contenido.

Define las tecnologías exactas del proyecto en un **formato YAML declarativo**, optimizado para que un agente lo consuma antes de generar código. Actúa como guardrail técnico: el agente sabe qué usar, qué versión y qué está prohibido.

**Secciones del archivo:**

| Sección | Tipo | Descripción |
|---|---|---|
| `backend` | **[OBLIGATORIO]** | Lenguaje, versión, framework, ORM y gestor de dependencias. |
| `frontend` | **[OBLIGATORIO]** | Framework/librería, versión, bundler y gestor de paquetes. |
| `base_de_datos` | **[OBLIGATORIO]** | Motor, versión y driver/conector utilizado. |
| `infraestructura` | **[OPCIONAL]** | Servidor de aplicaciones, contenedores, cloud provider. |
| `herramientas_de_desarrollo` | **[OPCIONAL]** | Linters, formateadores, pre-commit hooks. |
| `restricciones_globales` | **[OBLIGATORIO]** | Tecnologías o prácticas explícitamente prohibidas. |

**Esquema de cada tecnología:**

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | **[OBLIGATORIO]** | Nombre de la tecnología. |
| `version` | **[OBLIGATORIO]** | Versión exacta o rango permitido. |
| `adr` | **[OBLIGATORIO]** | Referencia al ADR que justifica la elección. Toda tecnología del stack debe tener un ADR asociado. |
| `nota` | **[OPCIONAL]** | Contexto breve sobre la elección o restricción. |

**Ejemplo:**

```yaml
backend:
  lenguaje:
    nombre: Python
    version: "3.11"
    adr: "0002-usar-python-3.md"
  framework:
    nombre: Django
    version: "4.2 LTS"
    nota: "Se usa la versión LTS para garantizar soporte extendido."
    adr: "0003-usar-django-como-framework.md"
  orm:
    nombre: Django ORM
    version: "4.2"
    adr: "0003-usar-django-como-framework.md"
  gestor_de_dependencias:
    nombre: pip
    version: "23.x"
    adr: "0002-usar-python-3.md"

base_de_datos:
  motor:
    nombre: PostgreSQL
    version: "15"
    adr: "0004-usar-postgresql.md"

restricciones_globales:
  - "No usar SQLAlchemy ni otro ORM alternativo al de Django."
  - "No instalar dependencias sin registrar un ADR."
```

**Guía de Llenado:**
- **Proyecto nuevo:** Definir al menos `backend`, `base_de_datos` y `restricciones_globales` antes de escribir código. Cada tecnología debe tener su ADR creado en `project/04_adrs/`.
- **Proyecto existente:** Verificar que el archivo refleje la realidad del repositorio. Toda adición o cambio de tecnología debe actualizarse aquí y tener su ADR correspondiente.

---


### `testing_strategy.md` — Estrategia de Testing

Define cómo se valida el software. Sin esta guía, el agente puede generar tests inconsistentes o en ubicaciones incorrectas.

| Sección | Tipo | Descripción |
|---|---|---|
| Tipos de Test Requeridos | **[OBLIGATORIO]** | Qué tipos de test se utilizan: unitarios, integración, E2E, etc. |
| Herramientas de Testing | **[OBLIGATORIO]** | Frameworks y runners: pytest, Jest, Playwright, etc. |
| Cobertura Mínima Esperada | **[OBLIGATORIO]** | Porcentaje de cobertura objetivo y criterios de aceptación. |
| Estructura de Archivos de Test | **[OBLIGATORIO]** | Dónde colocar los tests, naming de archivos y carpetas (ej: `tests/unit/`, `tests/integration/`). |
| Datos de Prueba / Fixtures | **[OPCIONAL]** | Cómo manejar mocks, fixtures y datos de prueba. |
| Ejecución Local vs CI | **[OPCIONAL]** | Diferencias entre ejecutar tests en el entorno local y en el pipeline de CI. |

**Frontmatter esperado:**

```yaml
---
type: testing_strategy
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
---
```

**Guía de Llenado:**
- **Proyecto nuevo:** Definir al menos los tipos de test y la estructura de archivos antes de empezar a implementar.
- **Proyecto existente:** Verificar que la estrategia documentada coincida con la realidad del repositorio.

---

### `api_guidelines.md` — Guías de API

> **CONDICIONAL:** Este archivo es obligatorio únicamente en proyectos que exponen endpoints (API REST, GraphQL, gRPC, etc). No aplica a proyectos monolíticos con frontend integrado que no exponen interfaces programáticas (ej: Django con motor de plantillas, Rails con vistas server-side). Si el proyecto no expone endpoints, este archivo no se crea.

Define los estándares de comunicación entre componentes y con el exterior. Garantiza consistencia en las interfaces HTTP y nomenclatura.

| Sección | Tipo | Descripción |
|---|---|---|
| Estándar de API | **[OBLIGATORIO]** | Tipo de API: REST, GraphQL, gRPC u otro. |
| Convenciones de Endpoints | **[OBLIGATORIO]** | Naming, versionado y estructura de URLs (ej: `/api/v1/resource`). |
| Formato de Request/Response | **[OBLIGATORIO]** | Estructura JSON estándar, envoltorios de respuesta, códigos de estado HTTP, formato de errores. |
| Autenticación y Autorización | **[OBLIGATORIO]** | Mecanismo utilizado: JWT, OAuth 2.0, API Keys, etc. |
| Documentación de API | **[OPCIONAL]** | Si se usa OpenAPI/Swagger: dónde se genera y cómo se mantiene. |
| Rate Limiting y Paginación | **[OPCIONAL]** | Políticas de throttling, límites de requests y estrategia de paginación. |

**Frontmatter esperado:**

```yaml
---
type: api_guidelines
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
api_type: ""         # REST | GraphQL | gRPC
---
```

**Guía de Llenado:**
- **Proyecto nuevo:** Definir el estándar de API y el formato de respuesta antes de implementar el primer endpoint.
- **Proyecto existente:** Actualizar cuando se agreguen nuevos patrones de comunicación o se cambie el mecanismo de autenticación.
