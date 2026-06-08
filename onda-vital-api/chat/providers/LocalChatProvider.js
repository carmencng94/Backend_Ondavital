/**
 * LocalChatProvider.js
 * Proveedor local de chat usando una IA local o respuestas predefinidas
 */

class LocalChatProvider {
  constructor() {
    this.nombre = 'LocalChat';
    this.timeout = 30000; // 30 segundos
  }

  /**
   * Obtiene respuesta usando un modelo local
   * @param {string} mensaje - Mensaje del usuario
   * @param {array} historial - Historial de conversación
   * @param {string} idioma - Idioma (es, en, de, ca)
   * @param {string} context - Contexto (public, admin)
   * @returns {Promise<object>}
   */
  async obtenerRespuesta(mensaje, historial = [], idioma = 'es', context = 'public') {
    try {
      // Por ahora, retorna un respuesta placeholder
      // En el futuro, esto puede conectarse a un modelo local como Ollama, LlaMA, etc.
      
      const respuestaPlaceholder = this.generarRespuestaLocal(mensaje, idioma, context);
      
      return {
        respuesta: respuestaPlaceholder,
        idioma: idioma,
        modelo: 'local',
      };
    } catch (error) {
      console.error(`[LocalChatProvider] Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Genera respuestas locales predefinidas
   * @private
   */
  generarRespuestaLocal(mensaje, idioma = 'es', context = 'public') {
    const respuestas = {
      es: {
        public: 'Soy Vitalis, asistente de Onda Vital. Por favor, describe qué tipo de servicio o sala te interesa.',
        admin: 'Bienvenido al panel de administración. ¿Qué necesitas actualizar?',
      },
      en: {
        public: 'I am Vitalis, assistant for Onda Vital. Please describe what service or room interests you.',
        admin: 'Welcome to the admin panel. What do you need to update?',
      },
      de: {
        public: 'Ich bin Vitalis, Assistent von Onda Vital. Bitte beschreiben Sie, welcher Service oder Raum Sie interessiert.',
        admin: 'Willkommen im Admin-Panel. Was möchten Sie aktualisieren?',
      },
      ca: {
        public: 'Sóc Vitalis, assistent de Onda Vital. Si us plau, descriu quin servei o sala t\'interessa.',
        admin: 'Benvingut al panell d\'administració. Què necessites actualitzar?',
      },
    };

    const idiomaConfig = respuestas[idioma] || respuestas['es'];
    return idiomaConfig[context] || idiomaConfig['public'];
  }
}

module.exports = LocalChatProvider;
