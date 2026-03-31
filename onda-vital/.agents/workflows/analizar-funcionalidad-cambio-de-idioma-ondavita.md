---
description: "Tu herramienta deberá realizar tres tareas principales: Rastreo (Crawling): Navegar por toda tu web como si fuera un usuario real. Detección de idioma: Analizar cada texto encontrado para ver si coincide con el idioma que debería mostrarse. Por ejemplo, si la web está en inglés y encuentra la frase 'Precio por hora/día', detectará que hay un error. Localización del origen: Buscar en tus archivos de código fuente dónde está escrita esa frase exacta para poder corregirla."
---
# Workflow: Analizar Funcionalidad de Cambio de Idioma

Una vez que se extraen los textos de la interfaz, el agente necesita verificar si están en el idioma correcto (por ejemplo, detectar frases accidentales en español cuando el usuario ha seleccionado inglés). Para esto se utiliza el LLM (Inteligencia Artificial) para analizar si la frase pertenece al idioma esperado, marcando como "error" cualquier discrepancia (ej. ver "terapias complementarias" navegando en inglés).

## Casos a Ignorar (Lista Blanca)
Ignorar nombres propios o técnicos que no tienen traducción:
- Onda Vital
- Martí Boneo
- Son Dameto
- WhatsApp
- Resosense
- Deawakening

## Reglas de Rastreo (Crawling)
1. **Detección de Atributos Ocultos:** No analizar únicamente el texto visible (`textContent`). Debes extraer y analizar también los atributos `placeholder` de todos los `<input>` / `<textarea>` y los textos alternativos `alt=` de las imágenes (`<img>`).
2. **Navegación Activa:** Usa el sub-agente de navegador o simula interacciones en las pestañas principales (Inicio, Salas, Quiropráctica, Resosense, Contacto) cambiando el selector de idioma para forzar el re-renderizado de los componentes JSX/Hyperscript.

## Integración y Corrección con IA
- **Búsqueda del Origen:** Al encontrar texto sin traducir, utiliza `grep_search` para localizar el archivo exacto de código fuente JS/HTML (ej. `public/src/components/AboutSection.js`).
- **Sugerencia de Código:** En lugar de simplemente advertir del error, envía el fragmento de código al LLM para generar directamente el código corregido usando la librería de traducciones preferida (`i18n.t('nueva_clave')`) y añade la clave al archivo de diccionario estático (`public/src/i18n.js`).

## Generación de Informe Visual
- Al finalizar, generar un informe visual (HTML o PDF en el directorio de artefactos) que incluya capturas de pantalla de la web de Onda Vital.
- Idealmente, en el reporte se destacarán con un recuadro rojo (o referencias claras) los lugares exactos de la pantalla donde los textos no han cambiado de idioma de forma correcta.
