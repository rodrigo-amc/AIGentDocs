# domain_modules — Módulos de Dominio

Este directorio contiene un archivo markdown por cada entidad de negocio del proyecto. Cada módulo es **independiente y autocontenido**.

---

## Cómo crear un nuevo módulo de dominio

1. Crear un nuevo archivo `.md` en este directorio con el nombre de la entidad en minúsculas (ej: `clients.md`, `invoices.md`, `orders.md`).
2. Escribir el contenido siguiendo la estructura definida en la sección **"Estructura de un Módulo de Dominio"** de este documento.
3. Completar todas las secciones marcadas como **[OBLIGATORIO]**.
4. Actualizar la Tabla de Contenidos en `docs/README.md`.

## Cómo actualizar un módulo existente

1. Abrir el archivo del módulo correspondiente.
2. Editar directamente las secciones que requieran cambios.
3. No eliminar secciones **[OBLIGATORIO]**, ni dejarlas vacías.
4. Si se agregan nuevas relaciones con otros módulos, verificar que los módulos referenciados también estén actualizados.

---

## Estructura de un Módulo de Dominio

Todo archivo de módulo de dominio debe contener las siguientes secciones, en este orden:

### Frontmatter

```yaml
---
type: domain_module
entity: ""           # Nombre canónico de la entidad (ej: clients, orders)
version: 1.0
last_updated: YYYY-MM-DD
state: pending       # pending | doing | done | deprecated
depends_on: []       # Módulos relacionados (ej: [orders, invoices])
code_paths: []       # Rutas a directorios/archivos de código (ej: ["/src/clients/"])
---
```

> *Nota sobre el `state`: El estado global del módulo se define por su iteración actual. Si al menos una User Story está activa en el roadmap, el estado del módulo es `doing`. Si todos sus requerimientos actuales están terminados, pasa a `done`.*

### Encabezado

```markdown
# [Nombre del Módulo]

> Propósito de esta entidad en una línea.
```

### Secciones del Módulo

| Sección | Tipo | Descripción |
|---|---|---|
| Descripción | **[OBLIGATORIO]** | Qué representa esta entidad en el contexto del negocio. |
| Atributos / Propiedades | **[OBLIGATORIO]** | Lista de campos con nombre, tipo de dato y descripción. |
| User Stories (Historias de Usuario) | **[OBLIGATORIO]** | Requerimientos funcionales en formato: "Como [rol], quiero [acción], para [valor]". |
| AC (Criterios de Aceptación) | **[OBLIGATORIO]** | Lista de condiciones verificables para cada User Story. |
| Reglas de Negocio | **[OBLIGATORIO]** | Validaciones, restricciones e invariantes de esta entidad. |
| Ciclo de Vida | **[OPCIONAL]** | Estados posibles y transiciones (ej: Borrador → Activo). |
| Relaciones | **[OBLIGATORIO]** | Conexiones con otros módulos y dependencias de negocio. |

---

## Requerimientos Cruzados (Opción C)

Para procesos que involucran múltiples módulos (ej: una "Venta" que afecta a Pedidos, Clientes y Stock), seguiremos el enfoque de **Responsabilidad Modularizada**:

1. **Cada módulo documenta su parte**: En la sección de User Stories, el módulo describe el impacto funcional en sí mismo.
2. **Referencias**: Si un proceso requiere que otro módulo reaccione, se especifica en los AC. 
   * *Ejemplo en `orders.md`*: "AC: Al confirmar, se debe invocar la reserva de stock definida en `stock.md`".
3. **Visión Global**: El flujo completo del proceso cruzado se visualiza mediante diagramas en `docs/02_architecture/data_flow.md`, referenciando las historias de cada módulo.

---

## Guía de Llenado (PRD Modular)

1. **Definir la Entidad**: Identificar qué datos maneja.
2. **Escribir las Historias**: Pensar en el valor para el usuario final. Evitar descripciones puramente técnicas como "el botón guarda datos".
3. **Establecer Criterios de Éxito (AC)**: Deben ser tan claros que un desarrollador o una IA puedan escribir un test a partir de ellos.
    * *Mal AC*: "El proceso debe ser rápido".
    * *Buen AC*: "El sistema debe responder en menos de 500ms bajo una carga de 100 requests/seg".

---

## Guías de Tamaño y Granularidad (Heurísticas)

Para evitar historias de usuario monolíticas o módulos inmanejables (lo cual perjudica el contexto de la IA y la agilidad del equipo human), aplica las siguientes heurísticas de "Límites Blandos". Si un Analista (humano o agente de IA) detecta que se superan estos límites, **debe detenerse y proponer la división del requerimiento**.

### Heurísticas para User Stories (US)
* **Límite de Criterios de Aceptación (AC):** Si una US tiene **más de 6 ACs**, es probable que contenga flujos alternativos complejos que merezcan su propia US. Sin embargo, no es un límite estricto. Si un Agente de IA detecta una US con más de 6 ACs, debe **detenerse, advertir al desarrollador humano y ofrecerle estas opciones**:
  1. Dividir la US en historias más pequeñas.
  2. Extraer validaciones complejas a la sección de "Reglas de Negocio".
  3. Aprobar explícitamente mantener la US tal como está, si el humano considera que es lógicamente indivisible.
* **Límite de Propósito (SRP):** Una US debe representar un único objetivo de negocio continuo. Si la US incluye "Registro de usuario, validación de email y configuración inicial de perfil", divídela en tres historias separadas.
* **Límite de Dependencias Concurrentes:** Si la implementación de una US requiere modificar la lógica de **más de 2 Módulos de Dominio concurrentemente**, divídela enfocándote en los entregables por módulo o rediseña la arquitectura del flujo.

### Heurísticas para Módulos de Dominio
* **Límite de Extensión Semántica:** No hay un límite numérico de líneas para un módulo, ya que su historial crecerá. En su lugar, el límite es **semántico y conceptual**. Un módulo de dominio no debe convertirse en un "God Object". Si notas que una User Story o el módulo en sí abarca lógicamente más de una responsabilidad o "funcionalidad core" distinta de su propósito original (ej: mezclar Facturación y Pagos enteros dentro de `clients.md`), debes detenerte, informar al usuario la falla de cohesión y proponer extraer esa funcionalidad a su propio módulo (ej: crear `invoices.md`).
