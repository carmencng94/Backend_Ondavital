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

router.post('/check-availability', async (req, res) => {
  try {
    const status = await ReservaController.checkAvailability(req);
    res.json(status);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/webhook/calendar', async (req, res) => {
  try {
    const result = await ReservaController.handleCalendarWebhook(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para calcular disponibilidad global de un día
router.get('/dia', async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ success: false, error: 'Falta parámetro fecha' });
    }
    const disponibilidad = await ReservaController.getDisponibilidadGlobal(fecha);
    res.json(disponibilidad);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ruta para calcular disponibilidad en slots PropTech
router.get('/disponibilidad', async (req, res) => {
  try {
    const { salaId, fecha } = req.query;
    if (!salaId || !fecha) {
      return res.status(400).json({ success: false, error: 'Faltan parámetros salaId o fecha' });
    }
    const disponibilidad = await ReservaController.getDisponibilidadSlots(salaId, fecha);
    res.json(disponibilidad);
  } catch (error) {
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
