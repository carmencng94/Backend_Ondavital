// Routes: contentRoutes.js

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener todos los textos de la web
router.get('/', contentController.getAllContent);

// Actualizar un texto de la web (requiere ser admin)
router.put('/:key', authMiddleware.verifyToken, contentController.updateContent);

module.exports = router;
