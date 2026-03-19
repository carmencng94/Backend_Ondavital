# Implementación de Contenido Dinámico con SQLite

Este plan detalla cómo modificaremos el backend y el frontend para que los textos de la página web principal se carguen desde la base de datos (SQLite) en lugar de estar fijos en el código.

## User Review Required

No hay decisiones críticas que requieran revisión más allá de la aprobación del plan general. El enfoque es seguro e iterativo.

## Proposed Changes

### Backend (Node.js/Express)
- Crearemos el modelo para manejar la base de datos SQLite y los endpoints de la API.

#### [NEW] `models/ContentModel.js`(file:///c:/Users/Usuario/backend_ondavital/onda-vital/models/ContentModel.js)
Crearemos este archivo para gestionar la tabla `content_blocks`.
- Inicializará la tabla si no existe: `CREATE TABLE IF NOT EXISTS content_blocks (id TEXT PRIMARY KEY, key TEXT UNIQUE NOT NULL, value TEXT, type TEXT, updated_at TEXT)`.
- Tendrá un método para obtener todo el contenido formateado como un objeto clave-valor.
- Insertará un texto de prueba inicial: `key: 'home_hero_title'`, `value: 'Nuestro Enfoque Eres Tú (Dinámico)'`.

#### [NEW] `controllers/contentController.js`(file:///c:/Users/Usuario/backend_ondavital/onda-vital/controllers/contentController.js)
Crearemos el controlador.
- `getAllContent`: Llama a `ContentModel` y devuelve JSON con los contenidos.

#### [NEW] `routes/contentRoutes.js`(file:///c:/Users/Usuario/backend_ondavital/onda-vital/routes/contentRoutes.js)
Crearemos las rutas.
- Define la ruta `GET /` que utiliza `contentController.getAllContent`.

#### [MODIFY] [server.js](file:///c:/Users/Usuario/backend_ondavital/onda-vital/server.js)(file:///c:/Users/Usuario/backend_ondavital/onda-vital/server.js)
- Importaremos `contentRoutes`.
- Montaremos la ruta en `app.use('/api/content', contentRoutes)`.

---
### Frontend (Vanilla JS)
- Modificaremos el frontend para consumir la nueva API.

#### [MODIFY] [public/src/main.js](file:///c:/Users/Usuario/backend_ondavital/onda-vital/public/src/main.js)(file:///c:/Users/Usuario/backend_ondavital/onda-vital/public/src/main.js)
- Añadiremos lógica al inicio para hacer `fetch('/api/content')`.
- Guardaremos el objeto resultante en una variable global (ej. `window.siteContent`) antes de renderizar la aplicación.
- Pasaremos este objeto a los componentes o los componentes lo leerán directamente.

#### [MODIFY] [public/src/components/HomeSection.js](file:///c:/Users/Usuario/backend_ondavital/onda-vital/public/src/components/HomeSection.js)(file:///c:/Users/Usuario/backend_ondavital/onda-vital/public/src/components/HomeSection.js)
- Cambiaremos el texto quemado `'Nuestro Enfoque Eres Tú'` por `window.siteContent?.home_hero_title || 'Nuestro Enfoque Eres Tú'`.

## Verification Plan

### Manual Verification
1. Arrancar el servidor (`npm run dev`).
2. Abrir la página principal en el navegador.
3. Verificar que el título principal ahora dice "Nuestro Enfoque Eres Tú (Dinámico)", lo cual confirmará que está leyendo de la base de datos de SQLite correctamente.
4. Revisar la consola del navegador para confirmar que no hay errores en la petición `/api/content`.
