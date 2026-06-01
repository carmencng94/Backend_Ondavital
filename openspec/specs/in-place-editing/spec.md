# in-place-editing Specification

## Purpose
TBD - created by archiving change live-visual-editing. Update Purpose after archive.
## Requirements
### Requirement: Detección Automática de Sesión de Administrador
El sistema cliente SHALL inspeccionar si el usuario cuenta con una cookie de sesión activa de tipo `adminToken` y SHALL activar el "Modo Editor Inline" automáticamente en caso afirmativo.

#### Scenario: Activación automática en carga del sitio
- **WHEN** el sitio web se carga en el navegador y la cookie `adminToken` se encuentra presente y es válida
- **THEN** el sistema añade la clase `editor-mode-active` al elemento `<body>` y habilita los escuchadores de eventos para edición inline en caliente.

---

### Requirement: Interacción e Interfaz de Edición Inline
El sistema SHALL rodear con un marco dorado suave y añadir un botón ✏️ a cualquier elemento DOM que cuente con un atributo identificador de traducción `data-i18n-key` al hacer hover sobre él, y SHALL convertirlo en un campo editable (input/textarea) al hacer clic.

#### Scenario: Clic abre campo de texto editable en el DOM
- **WHEN** el usuario hace clic sobre un bloque de texto que cuenta con el atributo `data-i18n-key` estando el Modo Editor activo
- **THEN** el sistema reemplaza temporalmente el nodo de texto por un elemento de entrada HTML (`<input>` o `<textarea>`) precargado con el valor de traducción actual en el idioma activo.

---

### Requirement: Persistencia Segura de Cambios Inline
Al salir del foco (evento "blur") o pulsar *Enter* dentro del campo editable, el sistema SHALL transmitir el nuevo valor de forma asíncrona mediante `POST /api/content/update` y SHALL guardar los cambios en la base de datos de manera segura y reactiva.

#### Scenario: Guardado exitoso y actualización reactiva al salir del foco
- **WHEN** el input de edición pierde el foco o se presiona *Enter*
- **THEN** el sistema cliente envía `{ key, value, lang }` al servidor, el cual actualiza el bloque en la tabla `content_blocks` de SQLite, responde con éxito y el DOM se re-renderiza con el nuevo valor de inmediato sin recargas.

#### Scenario: Rechazo de actualización por falta de autenticación
- **WHEN** se envía una petición `POST /api/content/update` sin un token de sesión `adminToken` válido
- **THEN** el sistema SHALL responder con estado HTTP `401 Unauthorized` o `403 Forbidden` y SHALL abortar la actualización en la base de datos.

