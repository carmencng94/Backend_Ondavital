// Routes: salaRoutes.js
// Propósito: Definir los endpoints de listado de salas.

const express = require('express');
const router = express.Router();
const SalaModel = require('../models/SalaModel');

router.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  const salas = SalaModel.obtenerTodas();
  res.json({ success: true, salas });
});

module.exports = router;
