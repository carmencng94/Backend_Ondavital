// Controller: contentController.js

const ContentModel = require('../models/ContentModel');
const ChangeLogModel = require('../models/ChangeLogModel');

exports.getAllContent = (req, res) => {
  try {
    const format = req.query.format === 'all' ? 'all' : 'flat';
    const content = ContentModel.obtenerTodos(format);
    res.json(content);
  } catch (error) {
    console.error('Error al obtener el contenido:', error);
    res.status(500).json({ error: 'Error del servidor al obtener el contenido.' });
  }
};

exports.updateContent = (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Falta el valor a actualizar' });
    }

    const current = ContentModel.obtenerTodos('flat') || {};
    const previousValue = current[key] || '';

    ContentModel.actualizarValor(key, value);

    try {
      ChangeLogModel.registrar({
        adminName: req.user?.username || 'admin',
        action: 'edit_text',
        targetKey: key,
        oldValue: String(previousValue).slice(0, 500),
        newValue: String(value).slice(0, 500),
        ip: req.ip
      });
    } catch (logError) {
      console.warn('No se pudo registrar audit_log (content):', logError.message);
    }

    res.json({ success: true, message: `Contenido actualizado correctamente`, key, value });
  } catch (error) {
    console.error(`Error al actualizar ${req.params.key}:`, error);
    res.status(500).json({ success: false, message: 'Error al actualizar el contenido' });
  }
};
