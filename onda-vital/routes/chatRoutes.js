// Routes: chatRoutes.js
// Propósito: Definir el endpoint de chat de la IA.

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const ChatController = require('../controllers/ChatController');

// 🛡️ Limitador de uso para el Chat (20 peticiones cada 15 min por IP)
// Esto evita que bots o usuarios malintencionados consuman saldo de la API sin control
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { 
    success: false, 
    error: "Has realizado demasiadas consultas. Por favor, espera 15 minutos para seguir chateando con Vitalis." 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de validación granular
const validateChat = [
  body('mensaje')
    .isString()
    .trim()
    .notEmpty().withMessage('El mensaje no puede estar vacío.')
    .isLength({ max: 800 }).withMessage('El mensaje es demasiado largo para ser procesado.'),
  body('historial').optional().isArray(),
  body('idioma').optional().isString().isLength({ min: 2, max: 2 }),
  body('context').optional().isIn(['public', 'admin'])
];

router.post('/', chatLimiter, validateChat, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { mensaje, historial = [], idioma = 'es', context = 'public' } = req.body;
    const resultado = await ChatController.responder(mensaje, historial, idioma, context);
    res.json({ success: true, ...resultado });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lo siento, ha ocurrido un error al procesar tu mensaje.' });
  }
});

module.exports = router;
