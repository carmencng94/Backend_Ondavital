## Why

El asistente inteligente de Onda Vital actualmente inyecta el listado completo de todas las reservas históricas (`ReservaModel.obtenerTodas()`) dentro del prompt de sistema para conocer la disponibilidad de las salas. Conforme el número de reservas crezca, este diseño provocará una saturación de la ventana de contexto de la IA, incrementará drásticamente la latencia en las respuestas y disparará los costos de tokens. 

Limitar las reservas inyectadas únicamente a las fechas consultadas por el usuario o a un rango temporal inmediato resuelve este problema de raíz, manteniendo el prompt extremadamente compacto, económico y rápido.

## What Changes

- **Optimización de Consulta de Reservas**: Modificar la inyección de contexto en el *System Prompt* del chatbot para que solo consulte y cargue reservas asociadas a las fechas de interés detectadas en la consulta del usuario, en lugar de todo el histórico.
- **Ventana de Corto Plazo**: En caso de que no se detecte una fecha explícita en el mensaje del usuario, se aplicará por defecto la inyección de reservas para el día de hoy y los próximos 7 días para mantener al asistente al tanto de la agenda inmediata.
- **Nuevos Métodos en el Modelo**: Añadir métodos eficientes de filtrado por fecha o rango de fechas en `ReservaModel.js`.
- **Detección Dinámica de Fechas**: Incorporar un analizador ligero en `ChatController.js` para extraer menciones de fechas relativas ("hoy", "mañana", "lunes", "12 de junio") y convertirlas a formato estandarizado (`AAAA-MM-DD`).

## Capabilities

### New Capabilities
- Ninguna. Esta mejora optimiza la infraestructura interna de RAG sin introducir capacidades funcionales de cara al usuario final.

### Modified Capabilities
- Ninguna. No se modifican especificaciones ni comportamientos funcionales del negocio.

## Impact

- **Código Afectado**:
  - `onda-vital/models/ReservaModel.js`: Añadir consulta de filtrado en SQLite por rango de fechas/fechas específicas.
  - `onda-vital/controllers/ChatController.js`: Incorporar la lógica de extracción de fechas a partir del mensaje del usuario y reestructurar el método `_construirPromptCompleto`.
- **APIs**: Totalmente interno. No modifica contratos de endpoints REST externos.
- **Dependencias**: Ninguna nueva dependencia requerida.
