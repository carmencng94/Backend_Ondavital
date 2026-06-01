## 1. Configuración y Migraciones de Base de Datos

- [x] 1.1 Configurar variables de entorno relativas a Google Calendar en el archivo `.env` (`GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY` o ruta al JSON de credenciales).
- [x] 1.2 Modificar `onda-vital/models/ReservaModel.js` para añadir las columnas `google_event_id` y `sync_status` de manera automatizada si no existen en la tabla `reservas`.

## 2. Implementación del Servicio de Calendario (GoogleCalendarService)

- [x] 2.1 Crear el archivo `onda-vital/services/GoogleCalendarService.js` inicializando la librería `googleapis` y autenticando con la Cuenta de Servicio de Google.
- [x] 2.2 Implementar en `GoogleCalendarService.js` las funciones `crearEvento(reserva)`, `actualizarEvento(reserva)` y `eliminarEvento(eventId)` retornando promesas estructuradas.

## 3. Acoplamiento en Controladores y Endpoint de Webhook

- [x] 3.1 Modificar `ReservaController.crearReserva` para invocar asíncronamente `GoogleCalendarService.crearEvento` al confirmar una reserva y almacenar el ID del evento devuelto en SQLite.
- [x] 3.2 Modificar los flujos de rechazo o cancelación de reservas para llamar a `GoogleCalendarService.eliminarEvento` y limpiar el enlace del calendario.
- [x] 3.3 Refactorizar `ReservaController.handleCalendarWebhook` para procesar notificaciones push del canal de Google Calendar, implementando protección contra bucles de sincronización infinitos evaluando la propiedad extendida `origin`.

## 4. Pruebas y Auditorías (Verification)

- [x] 4.1 Levantar el servidor y validar logs para confirmar la correcta autenticación de la cuenta de servicio de Google.
- [x] 4.2 Probar manualmente la creación reactiva y eliminación de eventos en un calendario de pruebas configurado.
- [x] 4.3 Correr el Agente de Verificación Lingüística (`npm run verify`) para certificar estabilidad completa de traducciones y base de datos.
