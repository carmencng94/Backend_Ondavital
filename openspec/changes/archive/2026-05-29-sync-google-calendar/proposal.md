## Why

Actualmente, las reservas realizadas a través del chatbot o el sitio web se almacenan únicamente de manera local en SQLite (`memory.db`), requiriendo que el coordinador David valide y copie manualmente cada cita a su calendario de Google Calendar para evitar colisiones con eventos presenciales.

Implementar una sincronización bidireccional automatizada con **Google Calendar** resuelve esta ineficiencia: las reservas confirmadas online se crearán instantáneamente como eventos de calendario, y cualquier reprogramación o cancelación que David realice directamente desde su teléfono en Google Calendar se replicará de inmediato en el backend, manteniendo la agenda 100% coordinada y libre de errores humanos.

## What Changes

- **Integración con Google Calendar API**: Conectar el backend con Google Calendar utilizando la librería oficial `googleapis` (ya instalada como dependencia en el proyecto).
- **Creación y Actualización de Eventos**: Sincronizar automáticamente en el calendario cada vez que se crea una reserva o se modifica su estado en la base de datos local.
- **Soporte Bidireccional vía Webhook**: Activar la ruta de webhook `/api/reservas/webhook/calendar` para recibir notificaciones del canal push de Google. Al mover o eliminar una reserva en el calendario, el webhook actualizará automáticamente el estado en SQLite (`reservas`).
- **Control de Metadatos de Sincronización**: Añadir campos de control en la tabla `reservas` (como `google_event_id` y `sync_status`) para enlazar las entidades del calendario y de la base de datos.

## Capabilities

### New Capabilities
- `calendar-sync`: Sincronización bidireccional y reactiva entre las reservas de SQLite y el calendario oficial de Google Calendar de Onda Vital.

### Modified Capabilities
- Ninguna. No se alteran requisitos de negocio preexistentes en los catálogos principales.

## Impact

- **Código Afectado**:
  - `onda-vital/models/ReservaModel.js`: Añadir columnas y lógica de persistencia para el ID de evento de Google y estado de sincronización.
  - `onda-vital/controllers/ReservaController.js`: Incorporar orquestación para llamadas de creación, actualización y cancelación en la API de Google, y procesamiento del webhook de notificaciones.
  - `onda-vital/services/GoogleCalendarService.js` [NEW]: Crear un servicio especializado que inicialice las credenciales de la cuenta de servicio de Google y provea una API de comunicación limpia para eventos.
- **Rutas de API**:
  - `/api/reservas/webhook/calendar`: Consolidación del procesamiento de notificaciones push entrantes desde Google.
- **Variables de Entorno (.env)**:
  - Validar `GOOGLE_CALENDAR_ID` y añadir credenciales de la cuenta de servicio de Google (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` o ruta al archivo JSON de credenciales).
