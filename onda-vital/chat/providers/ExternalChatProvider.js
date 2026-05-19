/**
 * ExternalChatProvider.js
 * Proveedor de chat externo (OpenAI, Claude, etc.)
 */

class ExternalChatProvider {
  constructor() {
    this.nombre = 'ExternalChat';
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.modelo = process.env.CHAT_MODEL || 'gpt-3.5-turbo';
    this.timeout = 30000;
  }

  /**
   * Obtiene respuesta usando una API externa
   * @param {string} mensaje - Mensaje del usuario
   * @param {array} historial - Historial de conversación
   * @param {string} idioma - Idioma (es, en, de, ca)
   * @param {string} context - Contexto (public, admin)
   * @returns {Promise<object>}
   */
  async obtenerRespuesta(mensaje, historial = [], idioma = 'es', context = 'public') {
    try {
      if (!this.apiKey) {
        throw new Error('API key de OpenAI no configurada. Configura OPENAI_API_KEY en .env');
      }

      // Construcción del body para la API de OpenAI
      const messages = [
        ...historial,
        { role: 'user', content: mensaje }
      ];

      const body = {
        model: this.modelo,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500,
      };

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        timeout: this.timeout,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const respuesta = data.choices?.[0]?.message?.content || 'Sin respuesta';

      return {
        respuesta: respuesta,
        idioma: idioma,
        modelo: this.modelo,
      };
    } catch (error) {
      console.error(`[ExternalChatProvider] Error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ExternalChatProvider;
