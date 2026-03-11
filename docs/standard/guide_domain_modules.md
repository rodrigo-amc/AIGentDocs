---
type: standard_guide
scope: domain_modules
version: 1.2
last_updated: 2026-03-01
project_path: "project/01_product/domain_modules/"
required_files: []
optional_files: []
---

# domain_modules — Módulos de Dominio

Este directorio contiene un archivo markdown por cada **Agregado o Módulo de Dominio** del proyecto. Cada módulo es **independiente y autocontenido**, y puede representar una sola **Entidad** o un grupo de Entidades fuertemente cohesivas que comparten reglas de negocio y ciclo de vida transaccional (ej: el módulo `inventory.md` agrupa las entidades `article` y `direct_sale`).

---

## Cómo crear un nuevo módulo de dominio

1. Crear un nuevo archivo `.md` en este directorio con el nombre del módulo o entidad principal en minúsculas (ej: `clients.md`, `inventory.md`, `orders.md`).
2. Escribir el contenido siguiendo la estructura definida en la sección **"Estructura de un Módulo de Dominio"** de este documento.
3. Completar todas las secciones marcadas como **[OBLIGATORIO]**.
4. Actualizar la Tabla de Contenidos en `standard/README.md`.

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
module_name: ""      # Nombre del módulo o agregado (ej: inventory, sales)
entities: []         # Lista de entidades contenidas (ej: ["article", "direct_sale"])
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

> Propósito de este módulo o agregado en una línea.
```

### Secciones del Módulo

| Sección | Tipo | Descripción |
|---|---|---|
| Descripción | **[OBLIGATORIO]** | Qué representa este módulo y las entidades que contiene en el contexto del negocio. |
| Atributos / Propiedades | **[OBLIGATORIO]** | Lista de campos con nombre, tipo de dato y descripción. |
| User Stories (Historias de Usuario) | **[OBLIGATORIO]** | Requerimientos funcionales en formato: "Como [rol], quiero [acción], para [valor]". |
| AC (Criterios de Aceptación) | **[OBLIGATORIO]** | Lista de condiciones verificables para cada User Story. |
| Reglas de Negocio | **[OBLIGATORIO]** | Validaciones, restricciones e invariantes de las entidades contenidas. |
| Ciclo de Vida | **[OPCIONAL]** | Estados posibles y transiciones (ej: Borrador → Activo). |
| Relaciones | **[OBLIGATORIO]** | Conexiones con otros módulos y dependencias de negocio. |

---

## Requerimientos Cruzados (Opción C)

Para procesos que involucran múltiples módulos (ej: una "Venta" que afecta a Pedidos, Clientes y Stock), seguiremos el enfoque de **Responsabilidad Modularizada**:

1. **Cada módulo documenta su parte**: En la sección de User Stories, el módulo describe el impacto funcional en sí mismo.
2. **Referencias**: Si un proceso requiere que otro módulo reaccione, se especifica en los AC. 
   * *Ejemplo en `orders.md`*: "AC: Al confirmar, se debe invocar la reserva de stock definida en `stock.md`".
3. **Visión Global**: El flujo completo del proceso cruzado se visualiza mediante diagramas en `project/02_architecture/data_flow.md`, referenciando las historias de cada módulo.

---

## Guía de Llenado (PRD Modular)

1. **Definir el Módulo y Entidades**: Identificar qué datos maneja el agregado.
2. **Escribir las Historias**: Pensar en el valor para el usuario final. Evitar descripciones puramente técnicas como "el botón guarda datos".
3. **Establecer Criterios de Éxito (AC)**: Deben ser tan claros que un desarrollador o una IA puedan escribir un test a partir de ellos.
    * *Mal AC*: "El proceso debe ser rápido".
    * *Buen AC*: "El sistema debe responder en menos de 500ms bajo una carga de 100 requests/seg".

---

## Guías de Tamaño y Granularidad (Heurísticas)

Para evitar historias de usuario monolíticas o módulos inmanejables (lo cual perjudica el contexto de la IA y la agilidad del equipo human), aplica las siguientes heurísticas de "Límites Blandos". Si un Analista (humano o agente de IA) detecta que se superan estos límites, **debe detenerse y proponer la división del requerimiento**.

### Heurísticas para User Stories (US)
* **Límite de Criterios de Aceptación (AC):** Si una US tiene **más de 6 ACs**, es probable que contenga flujos alternativos complejos que merezcan su propia US. Sin embargo, no es un límite estricto. (Nota: Esto aplica al volumen de detalle de una funcionalidad sobre una Entidad específica, no al archivo entero). Si un Agente de IA detecta una US con más de 6 ACs, debe **detenerse, advertir al desarrollador humano y ofrecerle estas opciones**:
  1. Dividir la US en historias más pequeñas.
  2. Extraer validaciones complejas a la sección de "Reglas de Negocio" de la entidad correspondiente.
  3. Aprobar explícitamente mantener la US tal como está, si el humano considera que es lógicamente indivisible.
* **Límite de Propósito (SRP):** Una US debe representar un único objetivo de negocio continuo. Si la US incluye "Registro de usuario, validación de email y configuración inicial de perfil", divídela en tres historias separadas.
* **Límite de Dependencias Concurrentes:** Si la implementación de una US requiere modificar la lógica de **más de 2 Módulos de Dominio concurrentemente**, divídela enfocándote en los entregables por módulo o rediseña la arquitectura del flujo.

### Heurísticas para Módulos de Dominio (Agregados)
* **Límite de Extensión Semántica:** No hay un límite numérico de líneas para un módulo, ya que su historial crecerá. En su lugar, el límite es **semántico y conceptual**. Un módulo de dominio no debe convertirse en un "God Object". Si notas que un módulo agrupa Entidades que no comparten reglas de negocio estrictas o ciclos de vida simultáneos (ej: mezclar Facturación en el módulo de Clientes en lugar de tener `invoices.md`), debes detenerte, informar al usuario la falla de cohesión (violación del concepto de Agregado) y proponer extraer esa Entidad a su propio Módulo de Dominio.
