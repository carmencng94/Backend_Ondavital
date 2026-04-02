
# Admin Panel — Referencia Completa

Este archivo define la especificación completa del panel de administración de Onda Vital.
El panel permite al administrador (David) gestionar imágenes, textos y contenido de la web
sin tocar código, con validaciones, seguridad y una interfaz visual profesional.

---

## Objetivo del Panel

El administrador puede:

* Subir y reemplazar imágenes de la web
* Editar textos (títulos, descripciones, precios, botones)
* Gestionar contenido sin romper el diseño
* Ver historial de cambios
* Previsualizaer cambios antes de publicar

---

## Estructura de Archivos a Generar

```
onda-vital/
├── admin/
│   ├── AdminAuthController.js     # Login, JWT, logout
│   ├── AdminContentController.js  # CRUD content_blocks
│   ├── AdminImageController.js    # Upload, validación, sharp
│   └── AdminLogController.js      # Historial de cambios
├── middleware/
│   └── isAdmin.js                 # Verifica JWT en rutas protegidas
├── routes/
│   └── adminRoutes.js             # Todas las rutas /admin/*
├── models/
│   ├── ContentModel.js            # content_blocks en SQLite
│   └── ChangeLogModel.js          # audit_log en SQLite
├── database/
│   └── db.js                      # Conexión SQLite + init tablas
├── uploads/                       # Imágenes subidas (gitignored)
└── public/
    └── admin/
        ├── admin.html             # SPA del panel (HTML embebido)
        ├── admin.css              # Estilos del panel
        └── admin.js               # Lógica frontend del panel
```

---

## Dependencias Adicionales

```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "multer": "^1.4.5-lts.1",
  "sharp": "^0.32.6",
  "express-rate-limit": "^7.1.5",
  "better-sqlite3": "^9.4.3",
  "dompurify": "^3.0.6",
  "express-validator": "^7.0.1"
}
```

---

## Base de Datos SQLite

### Tabla: `content_blocks`

```sql
CREATE TABLE IF NOT EXISTS content_blocks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT NOT NULL,
  type       TEXT NOT NULL CHECK(type IN ('text','image','html')),
  label      TEXT,          -- Nombre legible para el admin: "Descripción Sala Jardín"
  max_length INTEGER,       -- Límite de caracteres para tipo text
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by TEXT           -- Email o nombre del admin que editó
);
```

### Tabla: `admin_users`

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_login    TEXT
);
```

### Tabla: `audit_log`

```sql
CREATE TABLE IF NOT EXISTS audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_name  TEXT NOT NULL,
  action      TEXT NOT NULL,  -- 'edit_text' | 'upload_image' | 'login' | 'logout'
  target_key  TEXT,           -- Qué content_block se modificó
  old_value   TEXT,           -- Valor anterior (para textos, max 500 chars)
  new_value   TEXT,           -- Valor nuevo (para textos, max 500 chars)
  ip_address  TEXT,
  timestamp   TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Datos Iniciales (seed)

```javascript
// Al iniciar la app, insertar si no existen:
const SEED_CONTENT = [
  { key: 'hero_titulo',          value: 'Tu espacio de bienestar en la ciudad', type: 'text',  label: 'Título principal (Hero)', max_length: 80  },
  { key: 'hero_subtitulo',       value: 'Salas de terapia, talleres y meditación', type: 'text', label: 'Subtítulo Hero',           max_length: 120 },
  { key: 'hero_image',           value: '/uploads/hero.webp',  type: 'image', label: 'Imagen de portada' },
  { key: 'sala_jardin_desc',     value: 'Sala con acceso exclusivo a jardín y terraza, ideal para grupos.', type: 'text', label: 'Descripción Sala Jardín', max_length: 200 },
  { key: 'sala_azul_desc',       value: 'Luminosa con vistas al jardín. Moqueta, proyector y A/C.', type: 'text', label: 'Descripción Sala Azul', max_length: 200 },
  { key: 'sala_despacho_desc',   value: 'Espacio íntimo y luminoso para consultas individuales.', type: 'text', label: 'Descripción Despacho+', max_length: 200 },
  { key: 'sala_terapia_a_desc',  value: 'Sala privada con mesa, camilla y lavabo.', type: 'text', label: 'Descripción Sala Terapia A', max_length: 200 },
  { key: 'sala_terapia_b_desc',  value: 'Sala privada adaptable: mesa o camilla.', type: 'text', label: 'Descripción Sala Terapia B', max_length: 200 },
  { key: 'contacto_whatsapp',    value: '601 39 21 61', type: 'text', label: 'WhatsApp de contacto', max_length: 20 },
  { key: 'contacto_email',       value: 'info@ondavital.com', type: 'text', label: 'Email de contacto', max_length: 80 },
  { key: 'about_texto',          value: 'Somos un espacio dedicado al bienestar integral.', type: 'text', label: 'Texto "Sobre Nosotros"', max_length: 500 },
  { key: 'footer_legal',         value: 'Política de privacidad · Aviso legal', type: 'text', label: 'Texto pie de página', max_length: 200 },
];
```

---

## Autenticación JWT

### `middleware/isAdmin.js`

```javascript
// Por qué: protege TODAS las rutas /admin/api/* en una sola capa
const jwt = require('jsonwebtoken');

module.exports = function isAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.admin = decoded; // { id, email, name }
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
```

### `admin/AdminAuthController.js`

```javascript
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../database/db');
const LogModel = require('../models/ChangeLogModel');

async function login({ email, password, ip }) {
  const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);
  if (!user) return { error: 'Credenciales incorrectas' };
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { error: 'Credenciales incorrectas' };

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  // Actualizar último login + audit log
  db.prepare('UPDATE admin_users SET last_login = datetime("now") WHERE id = ?').run(user.id);
  LogModel.registrar({ adminName: user.name, action: 'login', ip });

  return { token, admin: { name: user.name, email: user.email } };
}

module.exports = { login };
```

---

## Subida y Gestión de Imágenes

### `admin/AdminImageController.js`

```javascript
const sharp    = require('sharp');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const db       = require('../database/db');
const LogModel = require('../models/ChangeLogModel');

const UPLOAD_DIR     = path.join(__dirname, '../uploads');
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES  = ['image/jpeg', 'image/png', 'image/webp'];

async function subirImagen({ file, contentKey, adminName, ip }) {
  // 1. Validar tipo MIME (no solo extensión — por seguridad)
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    return { error: 'Formato no permitido. Usa JPG, PNG o WebP.' };
  }

  // 2. Validar tamaño
  if (file.size > MAX_SIZE_BYTES) {
    return { error: `La imagen pesa ${(file.size/1024/1024).toFixed(1)} MB. El máximo es 5 MB.` };
  }

  // 3. Validar dimensiones mínimas con sharp (detecta archivos corruptos)
  let meta;
  try {
    meta = await sharp(file.buffer).metadata();
  } catch {
    return { error: 'Archivo de imagen corrupto o inválido.' };
  }
  if (meta.width < 100 || meta.height < 100) {
    return { error: 'La imagen es demasiado pequeña (mínimo 100×100 px).' };
  }

  // 4. Nombre único para evitar conflictos
  const ext      = 'webp'; // siempre convertimos a webp para consistencia
  const filename = `${contentKey}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  const destPath = path.join(UPLOAD_DIR, filename);

  // 5. Optimizar con sharp: redimensionar si > 2000px, comprimir
  await sharp(file.buffer)
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(destPath);

  const publicPath = `/uploads/${filename}`;

  // 6. Actualizar content_blocks
  const old = db.prepare('SELECT value FROM content_blocks WHERE key = ?').get(contentKey);
  db.prepare(`
    INSERT INTO content_blocks (key, value, type, updated_at, updated_by)
    VALUES (?, ?, 'image', datetime('now'), ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value,
      updated_at = excluded.updated_at, updated_by = excluded.updated_by
  `).run(contentKey, publicPath, adminName);

  // 7. Borrar imagen anterior si existe y no es la seed
  if (old?.value && old.value.startsWith('/uploads/') && old.value !== publicPath) {
    const oldPath = path.join(__dirname, '..', old.value);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  // 8. Audit log
  LogModel.registrar({ adminName, action: 'upload_image', targetKey: contentKey,
    oldValue: old?.value || '', newValue: publicPath, ip });

  return { success: true, path: publicPath };
}

module.exports = { subirImagen };
```

### Configuración Multer (en routes)

```javascript
const multer = require('multer');
// Guardar en memoria para validar antes de escribir a disco
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});
```

---

## Edición de Textos

### `admin/AdminContentController.js`

```javascript
const createDOMPurify = require('dompurify');
const { JSDOM }       = require('jsdom');
const db              = require('../database/db');
const LogModel        = require('../models/ChangeLogModel');

// Por qué JSDOM + DOMPurify en backend: sanitizar antes de guardar, no solo en cliente
const purify = createDOMPurify(new JSDOM('').window);

function obtenerTodos() {
  return db.prepare('SELECT * FROM content_blocks ORDER BY type, key').all();
}

function obtenerPorClave(key) {
  return db.prepare('SELECT * FROM content_blocks WHERE key = ?').get(key);
}

function actualizar({ key, value, adminName, ip }) {
  const block = db.prepare('SELECT * FROM content_blocks WHERE key = ?').get(key);
  if (!block) return { error: 'Bloque de contenido no encontrado.' };

  // Validar longitud máxima
  if (block.max_length && value.length > block.max_length) {
    return { error: `Texto demasiado largo. Máximo: ${block.max_length} caracteres.` };
  }

  // Sanitizar: eliminar HTML/scripts maliciosos
  const clean = purify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  db.prepare(`
    UPDATE content_blocks
    SET value = ?, updated_at = datetime('now'), updated_by = ?
    WHERE key = ?
  `).run(clean, adminName, key);

  // Audit log con valor anterior
  LogModel.registrar({ adminName, action: 'edit_text', targetKey: key,
    oldValue: block.value.substring(0, 500), newValue: clean.substring(0, 500), ip });

  return { success: true, value: clean };
}

module.exports = { obtenerTodos, obtenerPorClave, actualizar };
```

---

## Audit Log

### `models/ChangeLogModel.js`

```javascript
const db = require('../database/db');

function registrar({ adminName, action, targetKey = null, oldValue = null, newValue = null, ip = null }) {
  db.prepare(`
    INSERT INTO audit_log (admin_name, action, target_key, old_value, new_value, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(adminName, action, targetKey, oldValue, newValue, ip);
}

function obtenerRecientes(limit = 50) {
  return db.prepare('SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?').all(limit);
}

module.exports = { registrar, obtenerRecientes };
```

---

## Rutas del Panel

### `routes/adminRoutes.js`

```javascript
const express       = require('express');
const router        = express.Router();
const rateLimit     = require('express-rate-limit');
const multer        = require('multer');
const isAdmin       = require('../middleware/isAdmin');
const AuthCtrl      = require('../admin/AdminAuthController');
const ContentCtrl   = require('../admin/AdminContentController');
const ImageCtrl     = require('../admin/AdminImageController');
const LogCtrl       = require('../models/ChangeLogModel');

const upload    = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5*1024*1024 } });

// Rate limiting en login: máx 10 intentos por 15 minutos por IP
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10,
  message: { error: 'Demasiados intentos. Espera 15 minutos.' } });

// Servir el panel HTML
router.get('/', (req, res) => res.sendFile('admin.html', { root: 'public/admin' }));

// Auth (sin protección JWT — son las rutas de entrada)
router.post('/api/login',  loginLimiter, async (req, res) => {
  const result = await AuthCtrl.login({ ...req.body, ip: req.ip });
  if (result.error) return res.status(401).json(result);
  res.json(result);
});

// Todas las siguientes requieren JWT válido
router.use('/api', isAdmin);

// Content blocks
router.get('/api/content',              (req, res) => res.json(ContentCtrl.obtenerTodos()));
router.get('/api/content/:key',         (req, res) => res.json(ContentCtrl.obtenerPorClave(req.params.key)));
router.put('/api/content/:key',         (req, res) => {
  const result = ContentCtrl.actualizar({ key: req.params.key, value: req.body.value,
    adminName: req.admin.name, ip: req.ip });
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Imágenes
router.post('/api/images/:key', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen.' });
  const result = await ImageCtrl.subirImagen({ file: req.file, contentKey: req.params.key,
    adminName: req.admin.name, ip: req.ip });
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// Audit log
router.get('/api/logs', (req, res) => res.json(LogCtrl.obtenerRecientes(100)));

module.exports = router;
```

---

## Variables de Entorno Adicionales

```env
JWT_SECRET=un_secreto_muy_largo_y_aleatorio_minimo_32_chars
ADMIN_INITIAL_EMAIL=admin@ondavital.com
ADMIN_INITIAL_PASSWORD=cambiar_en_produccion
```

---

## Integración en server.js

```javascript
// Añadir en server.js (además de las rutas existentes):
const adminRoutes = require('./routes/adminRoutes');
const path        = require('path');

// Servir imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas del panel admin
app.use('/admin', adminRoutes);

// Al arrancar: crear carpeta uploads si no existe
const fs = require('fs');
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
```

---

## Interfaz del Panel (Visual Design System)

### Principios de Diseño del Panel

El panel usa el mismo sistema de tokens que la web pública de Onda Vital pero con
una paleta más neutra y profesional, orientada a productividad:

```css
/* Tokens del panel admin */
:root {
  --admin-bg:        #F7F6F3;   /* Fondo general — blanco cálido */
  --admin-surface:   #FFFFFF;   /* Tarjetas y sidebar */
  --admin-border:    rgba(60,58,50,0.12); /* Bordes sutiles */
  --admin-text:      #2C2C2A;   /* Texto principal */
  --admin-muted:     #888780;   /* Texto secundario */
  --admin-accent:    #3A7C6E;   /* Verde Onda Vital — acciones primarias */
  --admin-accent-bg: #E8F3F1;   /* Fondo de elementos activos */
  --admin-danger:    #C0392B;   /* Errores y eliminación */
  --admin-warn:      #D68910;   /* Advertencias */
  --admin-success:   #1E8449;   /* Confirmaciones */
  --admin-radius:    10px;
  --admin-shadow:    0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
}
```

### Layout del Panel (3 zonas)

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR (220px fijo)  │  TOPBAR (título + breadcrumb)        │
│  ─────────────────     │  ─────────────────────────────────── │
│  Logo Onda Vital       │                                      │
│  ─────────────         │  ÁREA DE CONTENIDO PRINCIPAL         │
│  Dashboard             │                                      │
│  Imágenes         ●    │  (Vista activa: Dashboard /          │
│  Textos                │   Imágenes / Textos /                │
│  Vista previa          │   Historial / Previsualización)      │
│  Historial             │                                      │
│  ─────────────         │                                      │
│  [Avatar] David A.     │                                      │
│  Cerrar sesión         │                                      │
└──────────────────────────────────────────────────────────────┘
```

### Secciones del Panel

#### 1. Dashboard

* 4 tarjetas métricas: total content_blocks, imágenes, textos, último cambio
* Feed de actividad reciente (últimos 10 audit_log)
* Gráfico semanal de ediciones (barras simples en SVG inline)
* Accesos rápidos a las secciones más usadas

#### 2. Gestión de Imágenes

* Grid de cards, una por cada content_block de tipo `image`
* Cada card muestra: imagen actual (thumbnail), clave, fecha de última actualización
* Botón "Reemplazar imagen" → drag & drop con previsualización instantánea
* Indicador de peso y dimensiones antes de confirmar
* Barra de progreso durante la subida
* Mensaje de Vitalis si la imagen supera 3 MB: sugerencia de optimización

#### 3. Gestión de Textos

* Lista de todos los content_blocks de tipo `text`
* Cada fila: label legible, valor actual (truncado), contador de chars / max_length
* Click → abre editor inline (no modal) con textarea, contador de caracteres en tiempo real
* Botón "Previsualizar" → iframe con la web pública que refleja el cambio en caliente
* Botón "Guardar" (verde) / "Cancelar" (gris)
* Vitalis aparece si el texto supera el 90% de max_length: "Este texto está casi al límite. Intenta ser más conciso."

#### 4. Vista Previa

* Iframe de la web pública a escala 0.6 dentro del panel
* Botón "Abrir en nueva pestaña"
* Indicador de "Última actualización: hace X minutos"

#### 5. Historial de Cambios

* Tabla con columnas: Fecha, Admin, Acción, Campo modificado, Valor anterior → Valor nuevo
* Filtro por tipo de acción y por fecha
* Exportar a CSV (opcional)

---

## Asistente Vitalis en el Panel

El chatbot Vitalis se integra en el panel admin como un asistente contextual,
no como el widget público de reservas. Tiene un system prompt diferente:

```javascript
const ADMIN_SYSTEM_PROMPT = `
Eres Vitalis, el asistente del panel de administración de Onda Vital.
Tu rol aquí es ayudar al administrador (David) a gestionar el contenido de la web.

CAPACIDADES EN EL PANEL:
- Guiar paso a paso para subir imágenes correctamente
- Advertir cuando un texto supera la longitud recomendada
- Recordar buenas prácticas: imágenes < 2MB, textos concisos, alt text descriptivo
- Confirmar cambios importantes antes de guardarlos ("¿Seguro que quieres reemplazar la imagen del hero?")
- Explicar qué hace cada campo (qué es el "hero", dónde aparece el "subtítulo", etc.)

TONO: cercano, práctico, eficiente. Llama al admin por su nombre si lo conoces.
REGLA: nunca hagas cambios directamente. Siempre confirma primero con el admin.

EJEMPLOS DE INTERVENCIÓN:
- Si imagen > 3MB: "David, esta imagen pesa X MB. Te recomiendo reducirla para mejorar la velocidad. ¿La optimizo automáticamente?"
- Si texto > 90% límite: "Este texto está casi al límite de caracteres. ¿Quieres que te ayude a resumirlo?"
- Si cambia hero_image: "Vas a reemplazar la imagen principal de la web. ¿Confirmas el cambio?"
`;
```

El widget de Vitalis en el panel se muestra como un chat lateral colapsable (no flotante),
con el mismo estilo visual del panel admin pero usando el endpoint `/api/chat` existente,
pasando un flag `{ context: 'admin' }` para que ChatController seleccione el prompt correcto.

---

## Validaciones Frontend (admin.js)

```javascript
// Validaciones en cliente (complementan las del servidor, no las reemplazan)

const VALIDATORS = {
  image: (file) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return 'Formato no válido. Usa JPG, PNG o WebP.';
    if (file.size > 5 * 1024 * 1024) return `Peso: ${(file.size/1024/1024).toFixed(1)} MB. Máximo 5 MB.`;
    return null;
  },
  text: (value, maxLength) => {
    if (!value.trim()) return 'El texto no puede estar vacío.';
    if (maxLength && value.length > maxLength) return `Máximo ${maxLength} caracteres.`;
    // Detectar HTML/scripts básicos — el sanitizado real ocurre en servidor
    if (/<[^>]+>|javascript:/i.test(value)) return 'El texto no puede contener código HTML.';
    return null;
  }
};
```

---

## Seguridad — Checklist Completo

| Capa           | Medida                                                                           |
| -------------- | -------------------------------------------------------------------------------- |
| Autenticación | bcrypt rounds=12, JWT 8h, logout invalida token en cliente                       |
| Rate limiting  | 10 intentos/15min en `/admin/api/login`                                        |
| Rutas          | Middleware `isAdmin`en TODOS los endpoints `/admin/api/*`                    |
| Upload         | MIME check en backend (no solo extensión), tamaño 5MB, sharp valida integridad |
| Textos         | DOMPurify en servidor, max_length en DB                                          |
| Logs           | Audit completo: quién, qué, cuándo, desde qué IP                             |
| Archivos       | Nombres aleatorios (crypto.randomBytes), extensión forzada a .webp              |
| CORS           | Configurar para aceptar solo origen de la web propia                             |
| Headers        | Usar `helmet`para headers de seguridad HTTP                                    |

---

## Seed Inicial del Admin

```javascript
// En database/db.js, al inicializar:
const bcrypt = require('bcryptjs');

async function seedAdminUser() {
  const existing = db.prepare('SELECT id FROM admin_users WHERE email = ?')
    .get(process.env.ADMIN_INITIAL_EMAIL);
  if (existing) return;

  const hash = await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD, 12);
  db.prepare('INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)')
    .run(process.env.ADMIN_INITIAL_EMAIL, hash, 'David');

  console.log(`[Admin] Usuario inicial creado: ${process.env.ADMIN_INITIAL_EMAIL}`);
  console.log('[Admin] ⚠️  Cambia la contraseña tras el primer login.');
}
```

---

## Notas de Implementación

1. **`better-sqlite3` es síncrono** — no uses `async/await` con él. Ideal para Node.js single-thread.
2. **`dompurify` en Node** requiere `jsdom` como entorno DOM virtual.
3. **`sharp`** puede tardar en instalarse (compila código nativo). Documentar en README.
4. La carpeta `uploads/` debe añadirse a `.gitignore`.
5. En producción, servir imágenes desde un CDN en lugar de `/uploads` estático.
6. El panel admin vive en `/admin` — nunca en una URL predecible como `/dashboard` o `/panel`.
