// Routes: salaRoutes.js
// Propósito: Definir los endpoints de listado de salas.

const express = require('express');
const router = express.Router();
const SalaModel = require('../models/SalaModel');

router.get('/', (req, res) => {
  // Función pura
  const salas = SalaModel.obtenerTodas();
  res.json({ success: true, salas });
});

module.exports = router;
