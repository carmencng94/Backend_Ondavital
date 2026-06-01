## 1. Implementación de API Segura en el Backend

- [x] 1.1 Crear en `onda-vital/controllers/contentController.js` el método `actualizarValorInline` que recoja de forma sanitizada las variables `{ key, value, lang }` del body de la petición y ejecute la llamada asíncrona a `ContentModel.actualizarValor`.
- [x] 1.2 Añadir y exportar en `onda-vital/routes/contentRoutes.js` la ruta `POST /update` protegida con el middleware criptográfico `authMiddleware.verifyAdmin` vinculándola al nuevo controlador.

## 2. Etiquetado de Nodos DOM con Claves de Traducción

- [x] 2.1 Modificar el archivo `onda-vital/public/src/components/HomeSection.js` inyectando de forma explícita el atributo `'data-i18n-key'` en los elementos de texto dinámicos principales de la sección de inicio (como `home_hero_main`, `home_hero_sub`, `home_glass_1`, `home_glass_2`, `home_intro_title`, `home_intro_desc`).
- [x] 2.2 Modificar otros componentes estructurales en la carpeta `onda-vital/public/src/components/` (como `AboutSection.js` y `SalasSection.js`) agregando los respectivos atributos de clave `'data-i18n-key'` a sus textos editables.

## 3. Lógica del Editor Inline y Estilos CSS (Cliente)

- [x] 3.1 Incorporar en `onda-vital/public/src/main.js` la verificación inicial de sesión (inspeccionando la cookie `adminToken`) e inyectar dinámicamente las clases y estilos globales CSS de hover para elementos editables (marcos dorados, cursor de texto y el indicador de lápiz "✏️").
- [x] 3.2 Desarrollar e integrar en `onda-vital/public/src/main.js` el escuchador de clic global con delegación de eventos: al interactuar con un nodo que contenga `data-i18n-key`, se intercambiará su contenido de texto por un nodo `<input type="text">` o `<textarea>` respetando la tipografía y dimensiones originales.
- [x] 3.3 Implementar en `onda-vital/public/src/main.js` el disparador de eventos `blur` y `keydown` (Enter) en los campos de edición, efectuando la llamada `fetch('/api/content/update')` y forzando de forma reactiva el re-renderizado instantáneo de la aplicación mediante la función `render(App(), container)` tras un éxito en la respuesta de guardado.

## 4. Auditoría y Pruebas de Estabilidad

- [x] 4.1 Arrancar y validar el funcionamiento seguro del Modo Editor Inline autenticándose previamente en el panel admin.
- [x] 4.2 Probar interactivamente en el navegador que al realizar modificaciones inline en la web pública, los textos cambien en vivo y se guarden de forma persistente en la base de datos SQLite.
- [x] 4.3 Ejecutar el script oficial de validación del proyecto (`npm run verify`) para certificar que el sistema permanezca en un 100% de consistencia de datos e idiomas.
