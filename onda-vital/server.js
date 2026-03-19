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

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/salas', salaRoutes); // Endpoint opcional para consultar el catálogo
app.use('/api/content', contentRoutes);

// Ruta por defecto que sirve el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de Onda Vital escuchando en http://localhost:${PORT}`);
});
