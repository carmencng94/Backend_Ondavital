// Routes: reservaRoutes.js
// Propósito: Definir los endpoints relacionados con reservas públicas.
// Solo extrae de req/res y llama al Controller.

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const ReservaController = require('../controllers/ReservaController');

// 🛡️ Limitador de reservas para evitar SPAM y abusos en base de datos
const bookingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 5, // máx 5 peticiones por IP por minuto
  message: { 
    success: false, 
    error: "Has realizado demasiadas solicitudes en poco tiempo. Por favor, espera un minuto." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', bookingLimiter, async (req, res) => {
  try {
    // Delegar lógica al controlador
    const reserva = await ReservaController.crearReserva(req.body);
    res.status(201).json({ success: true, reserva });
  } catch (error) {
    // Manejo de errores
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/check-availability', bookingLimiter, async (req, res) => {
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

module.exports = router;
