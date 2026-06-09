// server.js
// Propósito: Punto de entrada de la aplicación Express

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const chatRoutes = require('./routes/chatRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const salaRoutes = require('./routes/salaRoutes');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminLogsRoutes = require('./routes/adminLogsRoutes');
const adminReservaRoutes = require('./routes/adminReservaRoutes');
const adminFeedbackRoutes = require('./routes/adminFeedbackRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3051;
const helmet = require('helmet');

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares de Seguridad 🛡️
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
      fontSrc: ["'self'", "https:", "data:", "fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }
})); // Cabeceras HTTP de seguridad (activando CSP restrictiva)
app.disable('x-powered-by'); // No indicar qué tecnología usamos para no dar pistas a atacantes

// CORS restringido para permitir cookies de sesión del admin sin abrir la API a cualquier origen.
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limitar el tamaño del body para evitar inundaciones (DDoS local)

const authMiddleware = require('./middleware/authMiddleware');

// Servir la página de inicio de sesión secreta del admin (configurable en .env, por defecto /acceso)
const adminLoginPath = process.env.ADMIN_LOGIN_PATH || '/acceso';
app.get(adminLoginPath, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'login.html'));
});

// Servir la carpeta de administración de forma protegida (debe ir antes del static público)
app.use('/admin', authMiddleware.verifyAdminPage, express.static(path.join(__dirname, 'admin')));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Rutas admin nuevas y protegidas (mantener aqui lo sensible de panel).
// Se dejan rutas legacy en paralelo para compatibilidad temporal.
app.use('/api/admin/logs', adminLogsRoutes);
app.use('/api/admin/reservas', adminReservaRoutes);
app.use('/api/admin/feedbacks', adminFeedbackRoutes);

// Rutas publicas existentes (flujo actual del sitio).
app.use('/api/chat', chatRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/salas', salaRoutes); // Endpoint opcional para consultar el catálogo
app.use('/api/content', contentRoutes);
app.use('/api/contact', contactRoutes);

// Ruta base API
app.get('/', (req, res) => {
  res.json({ message: 'Onda Vital API v1' });
});

// Respuesta homogénea para rutas inexistentes.
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

// Manejador global de errores para evitar stack traces al cliente.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor.'
      : (err.message || 'Error interno del servidor.')
  });
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de Onda Vital escuchando en http://localhost:${PORT}`);
});
