// Controller: contentController.js

const ContentModel = require('../models/ContentModel');

exports.getAllContent = (req, res) => {
  try {
    const content = ContentModel.obtenerTodos();
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

    ContentModel.actualizarValor(key, value);
    res.json({ success: true, message: `Contenido actualizado correctamente`, key, value });
  } catch (error) {
    console.error(`Error al actualizar ${req.params.key}:`, error);
    res.status(500).json({ success: false, message: 'Error al actualizar el contenido' });
  }
};
