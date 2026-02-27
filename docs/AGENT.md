# Instrucciones Operativas para Agentes de IA

Eres un agente de IA trabajando en un proyecto de software documentado bajo este estándar.
Este archivo define tus reglas de comportamiento global. Debes seguirlas en todo momento.

---

## Modo de Trabajo

Antes de actuar, identifica en qué modo estás trabajando según la indicación del usuario o la naturaleza de la tarea:

### Modo Onboarding (Documentación Inicial)

- **Aplica cuando llegas a un proyecto existente cuya documentación está incompleta o vacía** (los archivos de contenido contienen placeholders sin llenar).
- Tu objetivo es **analizar el código fuente del proyecto y completar la documentación** como borrador para revisión humana.
- Sigue el orden de adopción para **Proyecto Existente (Brownfield)** definido en `README.md`:
  1. Analizar el código → Llenar `03_engineering/tech_stack.yaml`.
  2. Diagramar la arquitectura existente → Completar `02_architecture/`.
  3. Documentar el producto → Completar `01_product/vision.md` y `domain_modules/`.
  4. Planificar el futuro → Configurar `01_product/roadmap.md` con las tareas pendientes.
  5. Registrar decisiones → Crear ADRs retroactivos en `04_adrs/`.
- **Presenta cada documento completado al usuario para su revisión** antes de marcarlo como definitivo.
- Una vez la documentación esté completa y aprobada, la próxima sesión comenzará en Modo Diseño o Modo Implementación según corresponda.

### Modo Diseño (Documentación)

- Aplica cuando se están creando o editando documentos en `docs/`.
- **No generes código fuente** en este modo. Tu foco es completar, corregir o estructurar la documentación del proyecto.
- Asegúrate de que todo documento nuevo cumpla con el frontmatter y las secciones obligatorias definidas en el README del directorio correspondiente.

### Modo Implementación (Código)

- Aplica cuando se está escribiendo o modificando código fuente del proyecto.
- La documentación en `docs/` es tu **fuente de verdad**. Léela antes de generar código, pero no la modifiques salvo para actualizar estados (`state` en frontmatter, tablero en `roadmap.md`).
- Todo código que generes debe respetar las reglas definidas en `03_engineering/`.

> Si no tienes claro en qué modo trabajar, pregunta al usuario antes de proceder.

---

## Protocolo de Entrada al Proyecto

Cuando inicies una nueva sesión o recibas una tarea, sigue este orden:

1. Lee `README.md` (raíz de `docs/`) para entender la estructura general del proyecto.
2. **Evalúa el estado de la documentación:**
   - Si los archivos de contenido (`vision.md`, `tech_stack.yaml`, etc.) están vacíos o con placeholders → **Modo Onboarding**.
   - Si la documentación está completa → Sigue el **Protocolo de Lectura** definido en `README.md`.
3. Antes de trabajar en cualquier directorio de `docs/`, lee el archivo `AGENT.md` de ese directorio. Contiene instrucciones específicas para ese contexto.

---

## Reglas Globales

### Documentación

- **No crees archivos fuera de la estructura definida en `README.md`.**
- **No modifiques la estructura de directorios** sin registrar un ADR en `04_adrs/`.
- Todo documento nuevo debe incluir el **frontmatter YAML** correspondiente a su tipo, según el README del directorio donde se crea.
- Las secciones marcadas como **[OBLIGATORIO]** no pueden eliminarse ni dejarse vacías.
- Al agregar o eliminar archivos de documentación, actualiza la Tabla de Contenidos en `README.md`.

### Código Fuente

- **Antes de generar código**, lee `03_engineering/tech_stack.yaml`. No utilices tecnologías, versiones o librerías que no estén listadas allí.
- **No instales ni propongas nuevas dependencias sin discutirlo con el desarrollador humano.** La incorporación de dependencias es una decisión estructural que impacta el diseño, la infraestructura de despliegue y las licencias del proyecto. El agente puede sugerir, pero la decisión y el registro del ADR correspondiente deben ser aprobados por el equipo humano.
- Cuando trabajes en un módulo de dominio, consulta el campo `code_paths` de su frontmatter para saber qué archivos o directorios de código le corresponden.

### Trazabilidad

- Cuando completes una User Story o tarea del `roadmap.md`, actualiza su estado en el tablero (muévela a `[Done]`).
- **Sincronización de Estados**: Existe un estado global en el frontmatter de cada módulo de dominio (`state`). Cada vez que muevas una tarea en el Kanban de `01_product/roadmap.md` a `[In Progress]` o a `[Done]`, estás **OBLIGADO** a abrir el módulo de dominio afectado y actualizar su `state` para que refleje la realidad actual:
  - Si al menos una US del módulo está en proceso → `state: doing`.
  - Si todas las US planificadas están completadas → `state: done`.

---

## Restricciones

- **No asumas información que no esté documentada.** Si necesitas un dato que no encuentras en `docs/`, pregunta al usuario antes de proceder.
- **No modifiques documentos con estado `done`** sin una justificación explícita (ADR o indicación directa del usuario).
- **No modifiques documentos con estado `doing`** sin coordinación previa con el usuario.

---

## Verificación antes de Finalizar

Antes de dar por terminada cualquier tarea, verifica:

- [ ] ¿El código generado respeta `tech_stack.yaml`?
- [ ] ¿Los documentos nuevos o modificados tienen frontmatter válido?
- [ ] ¿El `roadmap.md` refleja el avance realizado?
- [ ] ¿Las secciones `[OBLIGATORIO]` de los documentos tocados están completas?
- [ ] ¿Los archivos o directorios nuevos de código están registrados en el `code_paths` del módulo de dominio correspondiente?
