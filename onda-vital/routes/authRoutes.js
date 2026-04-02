// Routes: authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const loginRateLimit = require('../middleware/loginRateLimit');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint para inciar sesión
// Proteccion anti fuerza bruta:
// antes de ejecutar login, limitamos cantidad de intentos por IP.
router.post('/login', loginRateLimit, authController.login);

router.get('/session', authMiddleware.verifyToken, authController.session);

router.post('/logout', authController.logout);

module.exports = router;
