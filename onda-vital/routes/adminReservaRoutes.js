const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');
const authMiddleware = require('../middleware/authMiddleware');
const ChangeLogModel = require('../models/ChangeLogModel');

// Todas las rutas de este archivo son SOLO para administradores autenticados.
// Si no viene token valido, la peticion no pasa.
router.use(authMiddleware.verifyToken);

// Devuelve todas las reservas para la vista de gestion del panel admin.
router.get('/', async (req, res) => {
  try {
    const reservas = await ReservaController.listarTodas();
    res.json({ success: true, reservas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Confirma una reserva desde el panel admin.
// Ademas deja registro en audit_log para trazabilidad.
router.patch('/:id/confirmar', async (req, res) => {
  try {
    const resultado = await ReservaController.confirmarReserva(req.params.id);
    try {
      ChangeLogModel.registrar({
        adminName: req.user?.username || 'admin',
        action: 'confirm_reserva',
        targetKey: req.params.id,
        newValue: 'confirmada',
        ip: req.ip
      });
    } catch (logError) {
      console.warn('No se pudo registrar audit_log (confirm_reserva):', logError.message);
    }
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Rechaza una reserva desde el panel admin.
// Tambien registramos el cambio para historial.
router.patch('/:id/rechazar', (req, res) => {
  try {
    const resultado = ReservaController.rechazarReserva(req.params.id);
    try {
      ChangeLogModel.registrar({
        adminName: req.user?.username || 'admin',
        action: 'reject_reserva',
        targetKey: req.params.id,
        newValue: 'rechazada',
        ip: req.ip
      });
    } catch (logError) {
      console.warn('No se pudo registrar audit_log (reject_reserva):', logError.message);
    }
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;