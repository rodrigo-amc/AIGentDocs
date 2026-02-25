# Instrucciones para Agentes — Contexto de Ingeniería

Este archivo contiene las reglas operativas específicas para trabajar dentro de `03_engineering/`.
Antes de leer este archivo, asegúrate de haber leído el `AGENT.md` global en `docs/`.

---

## Propósito de este directorio

Aquí se define el **"Cómo"** del proyecto: las reglas técnicas, el stack tecnológico, la estrategia de testing y los contratos de API. Este directorio actúa como **guardrail técnico** para evitar que se utilicen librerías no aprobadas, patrones no deseados o tests inconsistentes.

---

## Reglas Operativas

### tech_stack.yaml

- **Léelo siempre antes de generar código.** Este archivo es tu fuente de verdad sobre qué tecnologías, versiones y librerías están permitidas en el proyecto.
- No generes código que utilice tecnologías, frameworks o librerías que no estén declaradas aquí.
- Si detectas que una tecnología necesaria no está en el stack, **no la instales ni la uses**. Infórmale al desarrollador humano para que evalúe su incorporación y registre el ADR correspondiente en `04_adrs/`.

### quality_attributes.md

- Define los atributos de calidad del sistema (rendimiento, seguridad, etc.). Si estás implementando un flujo crítico, consulta este archivo para conocer las métricas esperadas.
- Cada atributo usa el formato de **Escenario de Atributo de Calidad** (fuente, estímulo, entorno, respuesta, medida). Al agregar un nuevo atributo, respeta este formato.

### testing_strategy.md

- Define qué tipos de tests se usan, las herramientas y la cobertura esperada. **Antes de escribir tests**, consulta este archivo para saber dónde colocarlos, cómo nombrarlos y qué framework utilizar.
- No crees tests en ubicaciones o con herramientas que no estén definidas aquí.

### api_guidelines.md

- Este archivo es **condicional**: solo existe si el proyecto expone endpoints. Si existe, léelo antes de crear o modificar cualquier endpoint.
- Respeta las convenciones de naming, versionado de URLs, formato de respuesta y mecanismo de autenticación definidos aquí.

---

## Relación con ADRs

Todo ADR con estado **Aceptado** que modifique un estándar técnico **debe** reflejarse actualizando el archivo correspondiente en este directorio. El ADR registra el **"por qué" histórico**; este directorio mantiene el **"qué" vigente**.
