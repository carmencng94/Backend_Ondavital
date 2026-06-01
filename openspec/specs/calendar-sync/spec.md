## ADDED Requirements

### Requirement: Sincronización de Creación de Evento en Google Calendar
El sistema SHALL crear un evento en Google Calendar de manera inmediata cuando se registre una nueva reserva en estado "confirmada" o "pendiente" en la base de datos de Onda Vital.

#### Scenario: Creación exitosa de evento al guardar reserva
- **WHEN** se guarda una nueva reserva a través de `ReservaModel.guardar`
- **THEN** el sistema realiza una llamada asíncrona a la API de Google Calendar, crea el evento con los detalles de la sala, cliente y horario, y almacena el `google_event_id` devuelto en el registro correspondiente de la tabla `reservas`.

---

### Requirement: Eliminación de Eventos en Google Calendar por Cancelación
El sistema SHALL eliminar el evento correspondiente de Google Calendar de forma inmediata cuando una reserva sea marcada en el estado "rechazada" o sea eliminada del sistema.

#### Scenario: Cancelación exitosa de evento en el calendario
- **WHEN** una reserva con un `google_event_id` válido pasa al estado "rechazada" o es borrada por el administrador
- **THEN** el sistema realiza una llamada a la API de Google Calendar para eliminar el evento y actualiza el campo `sync_status` a "cancelado".

---

### Requirement: Actualización Dinámica por Notificaciones de Webhook (Push)
El sistema SHALL escuchar notificaciones push a través de su endpoint de webhook y SHALL sincronizar de vuelta en la base de datos local SQLite cualquier modificación de fecha, horario o eliminación del evento realizada directamente en la interfaz de Google Calendar.

#### Scenario: Reprogramación de fecha y hora desde Google Calendar
- **WHEN** el webhook `/api/reservas/webhook/calendar` recibe una notificación indicando que un evento enlazado ha sido reprogramado
- **THEN** el sistema recupera los nuevos metadatos del evento desde la API de Google, comprueba la disponibilidad de la sala y actualiza los campos `fecha` y `horario` de la reserva en SQLite para coincidir con la modificación.

#### Scenario: Cancelación/Eliminación del evento desde Google Calendar
- **WHEN** el webhook recibe una notificación de que un evento ha sido borrado del calendario
- **THEN** el sistema marca el estado de la reserva local en SQLite como "rechazada" o "cancelada" de manera reactiva.
