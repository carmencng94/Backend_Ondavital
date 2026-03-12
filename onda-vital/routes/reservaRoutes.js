// Routes: reservaRoutes.js
// Propósito: Definir los endpoints relacionados con reservas.
// Solo extrae de req/res y llama al Controller.

const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');

router.post('/', (req, res) => {
  try {
    // Delegar lógica al controlador
    const reserva = ReservaController.crearReserva(req.body);
    res.status(201).json({ success: true, reserva });
  } catch (error) {
    // Manejo de errores
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
