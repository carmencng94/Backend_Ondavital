/**
 * GrokProvider.js
 * Proveedor de chat usando Grok (API de xAI)
 */

class GrokProvider {
  constructor() {
    this.nombre = 'Grok';
    this.apiKey = process.env.GROK_API_KEY || '';
    this.modelo = process.env.GROK_MODEL || 'grok-beta';
    this.baseUrl = 'https://api.x.ai/v1';
    this.timeout = 30000;
  }

  /**
   * Obtiene respuesta usando Grok
   * @param {string} mensaje - Mensaje del usuario
   * @param {array} historial - Historial de conversación
   * @param {string} idioma - Idioma (es, en, de, ca)
   * @param {string} context - Contexto (public, admin)
   * @returns {Promise<object>}
   */
  async obtenerRespuesta(mensaje, historial = [], idioma = 'es', context = 'public') {
    try {
      if (!this.apiKey) {
        throw new Error('API key de Grok no configurada. Configura GROK_API_KEY en .env');
      }

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

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
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
        throw new Error(`Grok API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const respuesta = data.choices?.[0]?.message?.content;

      if (!respuesta || respuesta.trim() === '') {
        throw new Error('El modelo retornó una respuesta vacía');
      }

      return {
        respuesta: respuesta,
        idioma: idioma,
        modelo: this.modelo,
      };
    } catch (error) {
      console.error(`[GrokProvider] Error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = GrokProvider;
