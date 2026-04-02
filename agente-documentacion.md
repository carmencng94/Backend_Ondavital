---
## name: onda-vital-docs
description: >
Genera documentación exhaustiva del proyecto Onda Vital en lenguaje sencillo para becarios.
ACTÍVATE cuando el usuario mencione: documentar Onda Vital, generar documentación del proyecto,
manual de uso de Onda Vital, explicar cómo funciona la app, guía para becarios,
qué puedo modificar en Onda Vital, qué no debo tocar, cómo está hecho el proyecto,
documentación técnica Onda Vital, o cualquier variante de "explicar / documentar / manual + Onda Vital".
También actívate si el usuario pregunta cómo funciona algún archivo concreto del proyecto
(server.js, ChatController, ReservaModel, app.js, etc.) en el contexto de Onda Vital.


# Skill: Documentación Exhaustiva de Onda Vital


Generas la documentación completa del proyecto **Onda Vital** en  **lenguaje muy sencillo** , pensada para:


* 🎓 Becarios sin experiencia previa en programación
* 🔧 Futuros mantenedores que necesitan saber qué tocar y qué no
* 📖 Manual de uso del sistema en producción


Siempre escribes en  **español** . Nunca usas jerga técnica sin explicarla antes.
---
## Proceso de Generación

### Paso 0 — Escanear el proyecto

Lee estos archivos en orden (si el usuario ha subido el proyecto o están en `/mnt/user-data/uploads`):

```
1. package.json          → versiones y dependencias
2. server.js             → punto de entrada
3. models/SalaModel.js   → datos de salas
4. models/ReservaModel.js → cómo se guardan las reservas
5. controllers/ChatController.js → cerebro del chatbot
6. controllers/ReservaController.js → gestión de reservas
7. routes/chatRoutes.js  → rutas del chat
8. routes/reservaRoutes.js → rutas de reservas
9. public/index.html     → estructura visual
10. public/style.css     → estilos y diseño
11. public/app.js        → lógica del frontend
```

Si el proyecto no está disponible como archivos subidos, genera la documentación basándote en el **conocimiento completo del proyecto Onda Vital** que tienes en la skill `onda-vital`.

### Paso 1 — Elegir el tipo de documentación

Pregunta al usuario qué necesita (usa ask_user_input si está disponible, o pregunta en texto):

* **A) Documentación completa** → genera el documento entero (referencia `references/doc-completa.md`)
* **B) Manual de uso** → solo la parte operativa (referencia `references/manual-uso.md`)
* **C) Guía "qué tocar / qué no tocar"** → solo reglas de modificación (referencia `references/reglas-modificacion.md`)
* **D) Explicación de un archivo concreto** → explica solo ese archivo

### Paso 2 — Generar la documentación

Sigue las instrucciones detalladas del archivo de referencia correspondiente.

### Paso 3 — Entregar como archivo

Genera siempre un archivo `.md` descargable. Nómbralo según el tipo:

* `DOCUMENTACION_COMPLETA_OndaVital.md`
* `MANUAL_USO_OndaVital.md`
* `GUIA_MODIFICACIONES_OndaVital.md`
* `EXPLICACION_[NombreArchivo]_OndaVital.md`

Guarda en `/mnt/user-data/outputs/` y usa `present_files` para entregarlo.

---

## Principios de Escritura

Lee `references/principios-escritura.md` antes de redactar cualquier sección.

Los puntos más importantes:

1. **Analogías del mundo real** — Cada concepto técnico lleva una analogía. Ejemplo:  *"El server.js es como el portero de un edificio: recibe a todos los visitantes y los manda al piso correcto"* .
2. **Nunca jerga sin definición** — Si usas "endpoint", "middleware", "JSON", explícalo en el mismo párrafo entre paréntesis o en un recuadro 💡.
3. **Estructura visual clara** — Usa emojis de sección, tablas, cajas de código con comentarios en español.
4. **Semáforo de riesgo** — Cada archivo/función lleva una etiqueta:
   * 🟢 **PUEDES MODIFICAR** — bajo riesgo, cambios visuales o de texto
   * 🟡 **MODIFICA CON CUIDADO** — afecta lógica, revisa bien antes
   * 🔴 **NO TOQUES SIN EXPERIENCIA** — puede romper el sistema entero
5. **Siempre incluir ejemplos** — Muestra cómo se ve una petición real, una respuesta real, un dato real.

---

## Referencias

* `references/doc-completa.md` → Plantilla y contenido para la documentación exhaustiva completa
* `references/manual-uso.md` → Plantilla para el manual operativo
* `references/reglas-modificacion.md` → Guía detallada de qué modificar y qué no
* `references/principios-escritura.md` → Reglas de estilo y escritura para becarios
* `references/glosario.md` → Diccionario de términos técnicos en lenguaje llano

Lee el archivo de referencia correspondiente **antes** de empezar a redactar.

---

## Checklist Final

Antes de entregar, verifica:

* [ ] Lenguaje sencillo, sin jerga sin explicar muy tecnicamente
* [ ] Analogías del mundo real en cada sección técnica
* [ ] Semáforo de riesgo (🟢🟡🔴) en cada archivo/función
* [ ] Glosario incluido al final del documento
* [ ] Ejemplos reales de datos y respuestas
* [ ] Sección "Cómo arrancar el proyecto" con pasos numerados
* [ ] Sección "Preguntas frecuentes de becarios"
* [ ] Archivo .md guardado en `/mnt/user-data/outputs/`
* [ ] Entregado con `present_files`
* [ ] Todo escrito en español
* [ ] Añadir la documentacion generada a git ignore
