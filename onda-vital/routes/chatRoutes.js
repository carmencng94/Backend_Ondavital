// Routes: chatRoutes.js
// Propósito: Definir el endpoint de chat de la IA.

const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.post('/', async (req, res) => {
  try {
    const { mensaje, historial = [], idioma = 'es' } = req.body;
    // Delegar lógica al controlador
    const resultado = await ChatController.responder(mensaje, historial, idioma);
    res.json({ success: true, ...resultado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
