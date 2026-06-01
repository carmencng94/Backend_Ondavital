## Context

El flujo actual en `ChatController._construirPromptCompleto` recupera el total de las reservas mediante `ReservaModel.obtenerTodas()`. Este histórico completo se concatena al prompt de sistema. 

Para resolver el incremento exponencial de tokens, el sistema pasará a un esquema de **RAG Calendario Reactivo**, donde el backend analizará el mensaje del usuario para identificar la fecha o fechas de interés y extraerá de SQLite únicamente el subconjunto de reservas para esas fechas específicas o una ventana deslizante de 7 días.

## Goals / Non-Goals

**Goals:**
- Reducir el tamaño medio del prompt de sistema en más de un 80% en entornos de producción con alta densidad de reservas.
- Implementar un extractor local de fechas multilingüe robusto basado en expresiones regulares y mapeo relativo en Node.js.
- Proveer nuevos métodos de consulta indexados por rango de fechas en SQLite a través de `ReservaModel.js`.
- Mantener compatibilidad absoluta con el comportamiento del asistente para reservas en tiempo real.

**Non-Goals:**
- Delegar la extracción a una llamada previa de IA (para evitar doble latencia y sobrecostos).
- Implementar la sincronización activa con APIs externas (como Google Calendar), lo cual queda acotado a otro hilo de trabajo.

## Decisions

### 1. Algoritmo de Extracción de Fechas Local en Node.js
Para extraer las fechas del mensaje del usuario antes de conformar el prompt, utilizaremos un parser en JavaScript (`utils/dateParser.js`) que implemente:
* **Mapeo Relativo (Multilingüe)**:
  * "hoy", "today", "heute", "avui" -> Día actual (`T`).
  * "mañana", "tomorrow", "morgen", "demà" -> Día actual + 1 (`T+1`).
  * "pasado mañana", "day after tomorrow", "übermorgen" -> Día actual + 2 (`T+2`).
* **Regex de Formato Estándar**:
  * `DD/MM/YYYY`, `DD-MM-YYYY` y `YYYY-MM-DD`.
* **Rango Extendido**: Si se detectan múltiples fechas (ej. "quiero ir el lunes 15 o martes 16"), se acumularán todos los días correspondientes para consultar sus reservas unificadas en la DB.

*Alternativa descartada*: Intentar que la propia IA haga la consulta sobre la marcha (Function Calling/Tool use). Se descarta debido a que requiere que el proveedor soporte tools y añade un viaje de ida y vuelta a la API de IA incrementando el tiempo de respuesta al cliente.

### 2. Ventana de Fallback (Ventana Deslizante de 7 Días)
Si el usuario envía un mensaje genérico de saludo o una consulta teórica sobre terapias donde no se especifica ninguna fecha:
* El sistema inyectará por defecto las reservas correspondientes a **hoy y los próximos 7 días naturales**.
* Esto asegura que el asistente esté al tanto del calendario inmediato sin sobrecargar el prompt con reservas de meses anteriores o muy futuras.

### 3. Filtro por Fecha en ReservaModel
Añadir el método `ReservaModel.obtenerPorFechas(listaFechas)` que realice una consulta SQLite parametrizada:
```sql
SELECT id, sala, fecha, horario, estado 
FROM reservas 
WHERE fecha IN (?, ?, ...)
```
O un rango de fechas:
```sql
SELECT id, sala, fecha, horario, estado 
FROM reservas 
WHERE fecha >= ? AND fecha <= ?
```

## Risks / Trade-offs

- **[Risk]** El usuario usa expresiones complejas no contempladas en las expresiones regulares (ej: "el tercer jueves del próximo mes").
  - *Mitigation*: El prompt de sistema le indicará claramente a la IA la ventana de fechas de reservas que tiene disponible en su contexto. Si la IA detecta que el usuario pregunta por una fecha fuera de su ventana visible, responderá de forma conversacional solicitando aclaración o confirmación explícita (lo cual forzará al usuario a indicar la fecha de forma más estructurada o a reabrir la ventana).
