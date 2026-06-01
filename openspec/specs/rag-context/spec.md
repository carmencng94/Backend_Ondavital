## ADDED Requirements

### Requirement: Extracción de Fechas desde el Mensaje del Usuario
El sistema SHALL analizar el mensaje del usuario y extraer de forma robusta cualquier mención de fecha en formatos absolutos o relativos ("hoy", "mañana", "DD/MM/AAAA", etc.).

#### Scenario: Extracción exitosa de fecha relativa
- **WHEN** el usuario envía el mensaje "Quiero ver la disponibilidad para mañana" el día 29/05/2026
- **THEN** el sistema extrae la fecha "2026-05-30"

#### Scenario: Extracción exitosa de fecha absoluta en formato estándar
- **WHEN** el usuario envía el mensaje "Quiero reservar el 12/06/2026"
- **THEN** el sistema extrae la fecha "2026-06-12"

---

### Requirement: Filtrado de Reservas por Fecha de Interés
El sistema SHALL realizar consultas parametrizadas en SQLite para recuperar únicamente las reservas asociadas a las fechas de interés identificadas, evitando cargar todo el histórico.

#### Scenario: Consulta parametrizada con múltiples fechas de interés
- **WHEN** el usuario pregunta por disponibilidad para "el 12/06/2026 o el 13/06/2026"
- **THEN** el sistema realiza una consulta en la DB filtrando únicamente por las fechas "2026-06-12" y "2026-06-13"

---

### Requirement: Ventana Deslizante de Fallback de 7 Días
El sistema SHALL inyectar una ventana de reservas por defecto correspondiente al día de hoy y los próximos 7 días naturales cuando no se identifique ninguna fecha de interés explícita en el mensaje del usuario.

#### Scenario: Inyección por defecto sin fecha explícita
- **WHEN** el usuario envía el mensaje de saludo "Hola, qué tal?" el día 29/05/2026
- **THEN** el sistema recupera e inyecta en el prompt de sistema únicamente las reservas del periodo del "2026-05-29" al "2026-06-05" inclusive.
