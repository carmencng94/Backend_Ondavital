// Controller: uploadController.js
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const ContentModel = require('../models/ContentModel');
const ChangeLogModel = require('../models/ChangeLogModel');

// Asegurar que la carpeta uploads existe de forma estática
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer en memoria (para poder pasarlo a Sharp antes de guardar al disco)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Máximo 5MB
}).single('image');

exports.uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: 'Error de subida: ' + err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se incluyó ninguna imagen.' });
    }

    const { key } = req.body; // por ejemplo "hero_bg_image"
    if (!key) {
      return res.status(400).json({ success: false, message: 'Falta proveer una key asociada a la imagen.' });
    }

    try {
      // Renombrar dinámicamente para destruir caché de navegadores
      const filename = `${key}-${Date.now()}.webp`;
      const outputPath = path.join(uploadDir, filename);
      const current = ContentModel.obtenerTodos('flat') || {};
      const previousValue = current[key] || '';

      // Usar Sharp para convertir y comprimir inteligentemente
      await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toFile(outputPath);

      const publicUrl = `/uploads/${filename}`;
      
      // Guardar en SQLite
      const result = ContentModel.actualizarValor(key, publicUrl);
      
      // Si el campo no existía previamente, lo forzamos a existir (UPSERT simulado)
      if (result.changes === 0) {
        const db = require('better-sqlite3')(process.env.DB_PATH || './memory.db');
        const insertStmt = db.prepare('INSERT INTO content_blocks (key, value, type, updated_at) VALUES (?, ?, ?, ?)');
        insertStmt.run(key, publicUrl, 'image', new Date().toISOString());
      }

      try {
        ChangeLogModel.registrar({
          adminName: req.user?.username || 'admin',
          action: 'upload_image',
          targetKey: key,
          oldValue: String(previousValue).slice(0, 500),
          newValue: publicUrl,
          ip: req.ip
        });
      } catch (logError) {
        console.warn('No se pudo registrar audit_log (upload):', logError.message);
      }

      res.json({ success: true, url: publicUrl, message: 'Imagen optimizada y enlazada correctamente.' });
    } catch (error) {
      console.error('Error de compresión/subida:', error);
      res.status(500).json({ success: false, message: 'Error en el servidor procesando la imagen.' });
    }
  });
};
