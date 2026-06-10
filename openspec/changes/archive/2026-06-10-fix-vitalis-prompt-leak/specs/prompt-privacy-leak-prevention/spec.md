## ADDED Requirements

### Requirement: Prevención de Fugas de Información del Prompt de Sistema
El sistema SHALL garantizar que el asistente virtual de IA (Vitalis) no revele, describa o mencione explícitamente sus instrucciones internas, nombres de variables internas, ni detalles técnicos del flujo de reserva del backend al interactuar con el usuario.

#### Scenario: Consulta de capacidades del chatbot sin filtrar instrucciones internas
- **WHEN** el usuario pregunta "Qué puedes hacer por mí?" o similar
- **THEN** el sistema responde describiendo únicamente capacidades orientadas al cliente (consultar disponibilidad, planes/precios, solicitar pre-reservas) sin exponer los 4 pasos del protocolo interno, nombres de variables como {{RESERVAS_OCUPADAS}}, ni de base de datos o personal técnico.

### Requirement: Reemplazo Global de Marcadores en el Prompt de Sistema
El sistema SHALL realizar un reemplazo global de todas las ocurrencias del marcador de posición `{{RESERVAS_OCUPADAS}}` en la plantilla del prompt del sistema antes de enviarlo al proveedor de chat de IA.

#### Scenario: Reemplazo correcto de múltiples marcadores en el prompt
- **WHEN** se construye el prompt de sistema y la plantilla contiene múltiples menciones de `{{RESERVAS_OCUPADAS}}`
- **THEN** el sistema reemplaza todas y cada una de las instancias por la lista actual de reservas ocupadas o el texto por defecto, evitando enviar el marcador literal `{{RESERVAS_OCUPADAS}}` al modelo.

### Requirement: Corrección del Dominio del Prompt de Sistema
El sistema SHALL eliminar cualquier referencia inapropiada o errónea de dominio como "gestión inmobiliaria" de la descripción de la identidad y rol del asistente virtual.

#### Scenario: Inicialización del rol del asistente con dominio correcto
- **WHEN** el asistente responde a cualquier mensaje del usuario
- **THEN** el tono e identidad se centran exclusivamente en servicios de salud, bienestar y gestión/reserva de salas del centro Onda Vital Holistic.
