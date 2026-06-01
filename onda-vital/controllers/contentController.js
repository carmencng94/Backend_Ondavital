// Controller: contentController.js

const ContentModel = require('../models/ContentModel');
const ChangeLogModel = require('../models/ChangeLogModel');

exports.getAllContent = (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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
    const { value, lang } = req.body;

    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Falta el valor a actualizar' });
    }

    const targetLang = lang || 'es';
    const allContent = ContentModel.obtenerTodos('all');
    const previousValue = (allContent[targetLang] && allContent[targetLang][key]) || '';

    ContentModel.actualizarValor(key, value, targetLang);

    try {
      ChangeLogModel.registrar({
        adminName: req.user?.username || 'admin',
        action: `edit_text_${targetLang}`,
        targetKey: key,
        oldValue: String(previousValue).slice(0, 500),
        newValue: String(value).slice(0, 500),
        ip: req.ip
      });
    } catch (logError) {
      console.warn('No se pudo registrar audit_log (content):', logError.message);
    }

    res.json({ success: true, message: `Contenido actualizado correctamente`, key, value, lang: targetLang });
  } catch (error) {
    console.error(`Error al actualizar ${req.params.key}:`, error);
    res.status(500).json({ success: false, message: 'Error al actualizar el contenido' });
  }
};

exports.actualizarValorInline = (req, res) => {
  try {
    const { key, value, lang } = req.body;

    if (!key) {
      return res.status(400).json({ success: false, message: 'Falta la clave a actualizar (key)' });
    }
    if (value === undefined) {
      return res.status(400).json({ success: false, message: 'Falta el valor a actualizar (value)' });
    }

    const targetLang = lang || 'es';
    const allContent = ContentModel.obtenerTodos('all');
    const previousValue = (allContent[targetLang] && allContent[targetLang][key]) || '';

    ContentModel.actualizarValor(key, value, targetLang);

    try {
      ChangeLogModel.registrar({
        adminName: req.user?.username || 'admin',
        action: `edit_text_inline_${targetLang}`,
        targetKey: key,
        oldValue: String(previousValue).slice(0, 500),
        newValue: String(value).slice(0, 500),
        ip: req.ip
      });
    } catch (logError) {
      console.warn('No se pudo registrar audit_log (content inline):', logError.message);
    }

    res.json({ success: true, message: `Contenido inline actualizado correctamente`, key, value, lang: targetLang });
  } catch (error) {
    console.error('Error al actualizar contenido inline:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el contenido' });
  }
};

