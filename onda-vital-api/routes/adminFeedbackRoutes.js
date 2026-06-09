const express = require('express');
const router = express.Router();
const FeedbackModel = require('../models/FeedbackModel');
const authMiddleware = require('../middleware/authMiddleware');

const OpenRouterProvider = require('../chat/providers/OpenRouterProvider');
const GrokProvider = require('../chat/providers/GrokProvider');
const ExternalChatProvider = require('../chat/providers/ExternalChatProvider');
const LocalChatProvider = require('../chat/providers/LocalChatProvider');

function crearProveedor(tipo) {
  switch (tipo) {
    case 'openai': return new ExternalChatProvider();
    case 'openrouter': return new OpenRouterProvider();
    case 'grok': return new GrokProvider();
    case 'local': return new LocalChatProvider();
    default: return new OpenRouterProvider();
  }
}


// Todas estas rutas requieren estar autenticado como admin
router.use(authMiddleware.verifyToken);

// Obtener todas las quejas no resueltas
router.get('/', (req, res) => {
  try {
    const feedbacks = FeedbackModel.getUnresolved();
    res.json({ success: true, feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ success: false, message: 'Error al obtener feedback' });
  }
});

// Marcar como resuelto (lo borra de la BD)
router.post('/resolve', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: 'ID es requerido' });
  
  try {
    FeedbackModel.resolve(id);
    res.json({ success: true, message: 'Feedback resuelto (borrado)' });
  } catch (error) {
    console.error('Error resolving feedback:', error);
    res.status(500).json({ success: false, message: 'Error al resolver feedback' });
  }
});

// Generar Meta-Resumen
router.post('/meta-summary', async (req, res) => {
  try {
    const feedbacks = FeedbackModel.getUnresolved();
    
    if (feedbacks.length === 0) {
      return res.json({ success: true, message: 'No hay feedbacks nuevos para resumir.', summary: null });
    }

    // Preparar el texto para la IA
    const feedbacksText = feedbacks.map(f => 
      `Pregunta Usuario: ${f.user_message}\nRespuesta IA: ${f.ai_response}\nQueja: ${f.feedback_text}`
    ).join('\n---\n');

    const prompt = `Actúa como un analista de calidad de servicio al cliente. He aquí una lista de quejas de usuarios sobre las respuestas de un bot llamado Vitalis. Hazme un resumen en 3 líneas de cuáles son los principales errores que el bot está cometiendo, para que yo pueda corregir su comportamiento.\n\nQuejas:\n${feedbacksText}`;

    // Usar el proveedor configurado para generar el resumen
    const providerType = process.env.CHAT_PROVIDER || 'openrouter';
    const provider = crearProveedor(providerType);
    const result = await provider.obtenerRespuesta(prompt, [], 'es', 'admin');

    // Extraer los IDs para borrarlos
    const ids = feedbacks.map(f => f.id);
    FeedbackModel.deleteAll(ids);

    res.json({ 
      success: true, 
      message: 'Resumen generado y quejas limpiadas.', 
      summary: result.respuesta 
    });

  } catch (error) {
    console.error('Error al generar meta-resumen:', error);
    res.status(500).json({ success: false, message: 'Error al generar meta-resumen', error: error.message });
  }
});

module.exports = router;
