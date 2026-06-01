## Context

El sistema de Onda Vital requiere enlazar las reservas almacenadas en la tabla SQLite `reservas` con eventos reales en una cuenta de **Google Calendar** compartida. 

Para lograr esto de forma robusta, utilizaremos la API oficial de Google (`googleapis`) configurada con una **cuenta de servicio (Service Account)**. Esto permitirá al backend actuar directamente sobre el calendario de la clínica sin requerir autenticación manual interactiva por parte de los coordinadores.

## Goals / Non-Goals

**Goals:**
- Crear de manera robusta y asíncrona eventos en Google Calendar al guardar una reserva confirmada o pendiente.
- Proveer soporte para la eliminación de eventos cuando se rechaza una reserva.
- Consolidar la ruta de webhook `/api/reservas/webhook/calendar` para recibir canales de notificación de Google e incorporar sincronización reactiva bidireccional (reprogramar/cancelar en local si se cambia en el calendario).
- Evitar bucles infinitos de sincronización (Sync Loops) entre el backend y Google Calendar.

**Non-Goals:**
- Implementar autenticación OAuth 3-Legged interactiva para múltiples calendarios individuales de terapeutas (se utilizará una única cuenta de servicio del centro).

## Decisions

### 1. Autenticación Server-to-Server mediante Service Account
Para interactuar con la API de Google de forma automatizada:
* Utilizaremos un archivo JSON de credenciales o variables de entorno equivalentes (`GOOGLE_CLIENT_EMAIL` y `GOOGLE_PRIVATE_KEY`).
* El administrador compartirá explícitamente su calendario del centro (`GOOGLE_CALENDAR_ID`) con el correo de la cuenta de servicio otorgándole permisos de edición y administración.
* *Ventaja*: Cero fricción de logins interactivos para los coordinadores, ideal para operaciones continuas y desatendidas en el servidor.

### 2. Prevención de Bucles de Sincronización (Sync Loop Protection)
Cuando el backend realiza una inserción o edición de evento en Google Calendar, la API de Google dispara inmediatamente una notificación push hacia el webhook registrado. Si el webhook procesa esta llamada ciegamente, intentará re-actualizar SQLite, lo cual podría provocar llamadas circulares infinitas de API.
* **Solución técnica**: Al crear o editar eventos desde Onda Vital, inyectaremos un metadato en las propiedades extendidas del evento:
  ```json
  "extendedProperties": {
    "private": {
      "origin": "ondavital",
      "reservaId": "OV-YYYYMMDD-XXXX"
    }
  }
  ```
* Al recibir una notificación en el webhook, recuperaremos el evento y comprobaremos la propiedad privada `origin`. Si el estado de la reserva local y el evento coinciden exactamente (mismos slots, misma sala), el webhook ignorará la actualización, rompiendo de forma segura el bucle.

### 3. Migración Segura en SQLite
Añadiremos columnas adicionales a la tabla `reservas` de manera segura durante el inicio de la clase `ReservaModel`:
* `google_event_id` (TEXT): Identificador único del evento en la API de Google, clave para búsquedas y eliminaciones.
* `sync_status` (TEXT): Estado de la sincronización (ej: `'synced'`, `'pending_sync'`, `'failed'`, `'cancelled'`).

## Risks / Trade-offs

- **[Risk]** Pérdida de notificaciones de Webhook debido a micro-caídas del servidor local o fallos de red.
  - *Mitigation*: Implementaremos una tarea de sincronización periódica (cron ligero o al arrancar el servidor) que compare las últimas reservas modificadas localmente y los eventos del calendario mediante llamadas a la API de listado (`calendar.events.list`), reconciliando las diferencias de manera asíncrona.
