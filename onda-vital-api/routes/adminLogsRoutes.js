const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ChangeLogModel = require('../models/ChangeLogModel');

router.get('/', authMiddleware.verifyToken, (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const logs = ChangeLogModel.obtenerRecientes(limit);
    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error obteniendo audit_log:', error);
    res.status(500).json({ success: false, message: 'Error al obtener historial.' });
  }
});

module.exports = router;