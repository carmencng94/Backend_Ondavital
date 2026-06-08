const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

// Validar JWT antes de permitir subir imágenes
router.post('/', authMiddleware.verifyToken, uploadController.uploadImage);

module.exports = router;
