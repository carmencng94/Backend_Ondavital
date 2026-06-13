## ADDED Requirements

### Requirement: Validación de Disponibilidad Basada en Eventos de Google Calendar
El sistema SHALL consultar los eventos en el calendario de Google del dueño para comprobar la disponibilidad de horarios. Al realizar la validación, el sistema SHALL ignorar los eventos que hayan sido creados por Onda Vital (aquellos con la propiedad `event.extendedProperties.private.origin` igual a `ondavital`), permitiendo que el sistema de reserva local de SQLite controle la disponibilidad específica para cada sala de las reservas locales, mientras que solo los eventos personales del dueño bloquearán la disponibilidad de todas las salas de forma global.

#### Scenario: Consulta de disponibilidad libre con reserva en otra sala
- **WHEN** se consulta la disponibilidad para una sala en un horario determinado y existe un evento en Google Calendar para esa hora con el origen `ondavital` (creado para una sala diferente)
- **THEN** el sistema ignora ese evento de Google Calendar al verificar la ocupación de la sala actual.

#### Scenario: Consulta de disponibilidad ocupada con evento personal del dueño
- **WHEN** se consulta la disponibilidad para cualquier sala en un horario determinado y existe un evento en Google Calendar para esa hora que no tiene la propiedad `origin: 'ondavital'`
- **THEN** el sistema determina que el slot está ocupado (estado 'busy' o 'Red').

---

## MODIFIED Requirements

### Requirement: Sincronización de Creación de Evento en Google Calendar
El sistema SHALL crear un evento en Google Calendar de manera inmediata cuando se confirme una reserva en la base de datos de Onda Vital. Para evitar que el evento se muestre en color gris o difuminado en el calendario de Google del dueño, el sistema SHALL añadir al dueño del calendario como asistente con el estado de respuesta "aceptado" (accepted) y SHALL suprimir las notificaciones por correo de la invitación.

#### Scenario: Creación exitosa de evento al confirmar reserva
- **WHEN** el administrador confirma una reserva y llama a `ReservaController.confirmarReserva`
- **THEN** el sistema realiza una llamada asíncrona a la API de Google Calendar, crea el evento añadiendo al dueño del calendario (`calendarId`) como asistente con `responseStatus: 'accepted'`, utiliza `sendUpdates: 'none'` para evitar enviar correos, y almacena el `google_event_id` devuelto en el registro correspondiente de la tabla `reservas`.
