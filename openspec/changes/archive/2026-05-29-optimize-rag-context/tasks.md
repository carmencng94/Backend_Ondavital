## 1. Utilería de Parseo de Fechas (Date Parser)

- [x] 1.1 Crear el archivo utilitario `onda-vital/utils/dateParser.js` que implemente expresiones regulares multilingües (ES, EN, DE, CA) para extraer fechas absolutas y relativas.
- [x] 1.2 Implementar y ejecutar un script de pruebas local en `onda-vital/scratch/test_parser.js` para asegurar que el parser traduzca correctamente palabras clave como "hoy", "mañana", "lunes" y formatos como "12/06/2026".

## 2. Lógica de Consulta en Base de Datos (Model)

- [x] 2.1 Añadir en `onda-vital/models/ReservaModel.js` el método `obtenerPorFechas(fechasArray)` que realice una consulta segura en SQLite mediante `better-sqlite3` utilizando la instrucción `WHERE fecha IN (...)`.
- [x] 2.2 Añadir en `onda-vital/models/ReservaModel.js` el método `obtenerPorRangoFechas(fechaInicio, fechaFin)` para soportar de forma óptima consultas sobre periodos de tiempo continuos.

## 3. Integración en el Controlador Conversacional (Controller)

- [x] 3.1 Importar el módulo `dateParser` dentro de `onda-vital/controllers/ChatController.js`.
- [x] 3.2 Modificar el método `ChatController._construirPromptCompleto` para invocar el parser sobre el mensaje del usuario y extraer la lista de fechas de interés.
- [x] 3.3 Implementar la lógica de carga selectiva en `ChatController._construirPromptCompleto`, haciendo que consulte en `ReservaModel` únicamente las reservas asociadas a las fechas de interés detectadas, y aplicando como fallback el rango deslizante de 7 días naturales (desde el día de hoy hasta T+7).

## 4. Pruebas y Validación (Verification)

- [x] 4.1 Arrancar la aplicación localmente mediante `npm start` en el puerto de desarrollo.
- [x] 4.2 Realizar una prueba manual interactiva enviando un mensaje al chatbot que consulte disponibilidad para una fecha vacía e inmediatamente después para una fecha reservada (ej: "quiero reservar el 12 de junio") y certificar que responda con la agenda correcta.
- [x] 4.3 Ejecutar el script verificador del proyecto mediante `npm run verify` para asegurar que la cobertura de idioma y consistencia de datos se mantenga intacta en un 100%.
