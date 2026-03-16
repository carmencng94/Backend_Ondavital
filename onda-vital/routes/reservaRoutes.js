// Routes: reservaRoutes.js
// Propósito: Definir los endpoints relacionados con reservas.
// Solo extrae de req/res y llama al Controller.

const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');

router.post('/', async (req, res) => {
  try {
    // Delegar lógica al controlador
    const reserva = await ReservaController.crearReserva(req.body);
    res.status(201).json({ success: true, reserva });
  } catch (error) {
    // Manejo de errores
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ruta para que David confirme una reserva
router.patch('/:id/confirmar', async (req, res) => {
  try {
    const resultado = await ReservaController.confirmarReserva(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ruta para que David rechace una reserva
router.patch('/:id/rechazar', (req, res) => {
  try {
    const resultado = ReservaController.rechazarReserva(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
