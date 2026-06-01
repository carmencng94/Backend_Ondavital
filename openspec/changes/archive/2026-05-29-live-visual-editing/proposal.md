## Why

Actualmente, el administrador David debe editar los textos dinámicos navegando por una lista de claves de traducción en un panel administrativo separado, lo cual dificulta correlacionar cada clave con el lugar exacto en el que aparece en la web pública.

Implementar un **Editor Visual Directo (In-Place Editor)** de tipo WordPress en el frontend público resolverá esto: si David está logueado como administrador, podrá pasar el cursor sobre cualquier texto de la web pública, ver un marco de edición dorado, hacer clic sobre él, editarlo en línea (Inline) y guardar los cambios directamente en la base de datos de manera inmediata sin recargar la pantalla, logrando una experiencia de personalización sumamente fluida e intuitiva.

## What Changes

- **Detección Automática de Sesión Admin**: Incorporar lógica en el frontend público para verificar la presencia de la cookie de sesión del administrador (`adminToken`). Si existe, se activa automáticamente el "Modo Editor".
- **Comportamiento en Hover (Marco de Edición)**: Todos los elementos con textos dinámicos asociados a claves de traducción recibirán dinámicamente un borde dorado suave en hover y un botón flotante flotante de edición ("✏️").
- **Edición Inline (Inputs Reactivos)**: Al hacer clic en el texto, este se convertirá temporalmente en un bloque input o textarea (respetando los saltos de línea). Al hacer "Blur" (perder el foco) o pulsar *Enter*, se enviará el cambio.
- **API Segura de Actualización**: Habilitar y proteger el endpoint `POST /api/content/update` con el middleware `authMiddleware.verifyAdmin` para validar tokens antes de guardar cambios en la tabla `content_blocks` de SQLite.

## Capabilities

### New Capabilities
- `in-place-editing`: Edición inline y en tiempo real de los bloques de contenido de la web pública para usuarios autenticados con rol de administrador.

### Modified Capabilities
- Ninguna. No se alteran requisitos de negocio preexistentes.

## Impact

- **Código Afectado (Frontend)**:
  - `public/src/main.js`: Implementar el script de escucha del Modo Editor, envoltura de elementos editables, eventos de foco y envío de peticiones.
  - `public/src/utils.js`: Adaptar la utilería `render` o la función `h` para inyectar un atributo `data-key` en elementos que contengan textos dinámicos, facilitando su identificación unívoca en el DOM.
- **Código Afectado (Backend)**:
  - `routes/contentRoutes.js`: Añadir y proteger la ruta de actualización inline.
  - `controllers/contentController.js`: Lógica para procesar la petición y llamar a `ContentModel.actualizarValor`.
