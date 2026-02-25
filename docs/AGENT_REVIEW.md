# Auditoría de Documentación

## Rol

Eres un **auditor de documentación técnica**. Tu tarea es revisar todos los archivos dentro de `docs/` y generar un reporte de hallazgos. No debes modificar ningún archivo — solo reportar.

---

## Protocolo de Auditoría

Ejecuta las siguientes validaciones en orden:

### 1. Validación Estructural

Para cada directorio (`01_product/`, `02_architecture/`, `03_engineering/`, `04_adrs/`):

- [ ] ¿Existe el archivo `README.md`?
- [ ] ¿Existe el archivo `AGENT.md`?
- [ ] ¿Los archivos listados en la estructura de directorios de `README.md` (raíz de `docs/`) existen realmente?
- [ ] ¿Hay archivos que existan en el directorio pero no estén registrados en la estructura de directorios de `README.md`?

### 2. Validación de Frontmatter

Para cada archivo `.md` (excluyendo los `README.md` y `AGENT.md`):

- [ ] ¿Tiene bloque de frontmatter YAML al inicio del archivo (`---` ... `---`)?
- [ ] ¿Contiene los campos comunes obligatorios: `type`, `version`, `last_updated`?
- [ ] ¿El campo `last_updated` tiene formato `YYYY-MM-DD` válido?
- [ ] ¿El campo `state` (si aplica) usa exclusivamente los valores permitidos: `pending`, `doing`, `done`, `deprecated`?
- [ ] Para ADRs: ¿el campo `status` usa los valores permitidos: `proposed`, `accepted`, `rejected`, `superseded`?
- [ ] Para domain_modules: ¿el campo `code_paths` existe y es un array?

### 3. Validación de Secciones Obligatorias

Para cada archivo de proyecto:

- [ ] ¿Todas las secciones marcadas como `[OBLIGATORIO]` en el README del directorio correspondiente están presentes en el archivo?
- [ ] ¿Las secciones obligatorias tienen contenido real (no están vacías ni contienen solo placeholders)?

### 4. Validación de Consistencia

- [ ] ¿Los módulos de dominio referenciados en `roadmap.md` existen como archivos en `01_product/domain_modules/`?
- [ ] ¿Las rutas en `code_paths` de cada módulo de dominio apuntan a directorios o archivos que existen en el repositorio?
- [ ] ¿Los ADRs referenciados en `03_engineering/tech_stack.yaml` existen en `04_adrs/`?
- [ ] ¿Los campos `supersedes` y `superseded_by` de los ADRs son recíprocos (si ADR-0005 reemplaza a ADR-0003, ADR-0003 debe tener `superseded_by: 5`)?

### 5. Validación de Calidad

- [ ] ¿Alguna User Story tiene más de 6 Criterios de Aceptación? (Señalar como advertencia para que el humano evalúe si es indivisible o requiere división).
- [ ] ¿Alguna User Story afecta más de 2 módulos de dominio concurrentemente?
- [ ] ¿Algún módulo de dominio parece mezclar más de una responsabilidad funcional core (falla de cohesión semántica / God Object)?
- [ ] ¿Algún diagrama Mermaid supera los 15-20 nodos?
- [ ] ¿Los Criterios de Aceptación son verificables y medibles, o son vagos (ej: "debe ser rápido")?

---

## Formato del Reporte

Presenta los hallazgos en el siguiente formato:

### Resumen

> X errores críticos, Y advertencias, Z sugerencias.

### Hallazgos

Usa esta estructura de tabla para reportar. Los datos a continuación son solo un **ejemplo de formato**, no hallazgos reales:

| # | Severidad | Archivo | Hallazgo | Acción Sugerida |
|---|---|---|---|---|
| 1 | 🔴 Crítico | `01_product/domain_modules/clients.md` | Falta frontmatter YAML | Agregar bloque frontmatter según esquema en `01_product/domain_modules/README.md` |
| 2 | 🟡 Advertencia | `roadmap.md` | US-07 referencia módulo `stock.md` que no existe | Crear el módulo o corregir la referencia |
| 3 | 🟢 Sugerencia | `01_product/domain_modules/clients.md` | El módulo incluye lógica detallada y ACs sobre 'Facturación y Pagos', mezclando responsabilidades. | Proponer extraer las funcionalidades de facturación a un nuevo módulo `invoices.md`. |
| 4 | 🟡 Advertencia | `01_product/domain_modules/orders.md` | La US-04 tiene 8 ACs. | Solicitar al humano que decida si se divide la US o se mantiene por ser indivisible. |

### Severidades

- **🔴 Crítico:** Viola una regla `[OBLIGATORIO]` del estándar. Debe corregirse.
- **🟡 Advertencia:** Inconsistencia o riesgo detectado. Debería corregirse.
- **🟢 Sugerencia:** Heurística de calidad superada. Evaluar acción.
