/**
 * OpenRouterProvider.js
 * Proveedor de chat usando OpenRouter (permite usar múltiples modelos con fallback automático)
 */

class OpenRouterProvider {
  constructor() {
    this.nombre = 'OpenRouter';
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    
    // Soporte para múltiples modelos separados por comas
    // Forzamos los modelos gratuitos aquí en caso de que la variable de entorno esté atascada en la terminal.
    const modelEnv = 'google/gemini-2.0-flash-lite-preview-02-05:free,meta-llama/llama-3.3-70b-instruct:free,google/gemini-2.5-flash-lite,deepseek/deepseek-chat,openrouter/auto';
    this.modelos = modelEnv.split(',').map(m => m.trim()).filter(Boolean);
    
    this.baseUrl = 'https://openrouter.ai/api/v1';
    this.referer = process.env.OPENROUTER_REFERER || 'https://ondavital.com';
    this.title = process.env.OPENROUTER_TITLE || 'Onda Vital Chat';
    this.timeout = 30000;
  }

  /**
   * Obtiene respuesta usando OpenRouter (con rotación/fallback automático entre los modelos configurados)
   * @param {string} mensaje - Mensaje del usuario
   * @param {array} historial - Historial de conversación
   * @param {string} idioma - Idioma (es, en, de, ca)
   * @param {string} context - Contexto (public, admin)
   * @returns {Promise<object>}
   */
  async obtenerRespuesta(mensaje, historial = [], idioma = 'es', context = 'public') {
    try {
      if (!this.apiKey) {
        throw new Error('API key de OpenRouter no configurada. Configura OPENROUTER_API_KEY en .env');
      }

      if (this.modelos.length === 0) {
        throw new Error('No se han especificado modelos en OPENROUTER_MODEL');
      }

      // OPTIMIZACIÓN: Mantener el System Prompt (historial[0]) y enviar solo los últimos 6 mensajes del historial
      // Esto reduce drásticamente el consumo de tokens en conversaciones largas.
      const systemPrompt = historial.length > 0 && historial[0].role === 'system' ? historial[0] : null;
      const mensajesRecientes = historial.slice(systemPrompt ? 1 : 0).slice(-6);
      
      const messages = [];
      if (systemPrompt) messages.push(systemPrompt);
      messages.push(...mensajesRecientes);
      messages.push({ role: 'user', content: mensaje });

      let ultimoError = null;

      // Intentar con cada modelo en orden hasta que uno responda con éxito
      for (const modelo of this.modelos) {
        try {
          console.log(`[OpenRouterProvider] Intentando llamar a OpenRouter con el modelo: ${modelo}`);
          
          const body = {
            model: modelo,
            messages: messages,
            temperature: 0.7,
            max_tokens: 800, // Ahorro de tokens en salida
          };

          const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
              'HTTP-Referer': this.referer,
              'X-Title': this.title,
            },
            body: JSON.stringify(body),
            timeout: this.timeout,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP status ${response.status}`);
          }

          const data = await response.json();
          const respuesta = data.choices?.[0]?.message?.content;

          if (!respuesta || respuesta.trim() === '') {
            throw new Error(`El modelo retornó una respuesta vacía. Data: ${JSON.stringify(data)}`);
          }

          console.log(`[OpenRouterProvider] ¡Éxito usando el modelo: ${modelo}!`);
          return {
            respuesta: respuesta,
            idioma: idioma,
            modelo: modelo,
          };
        } catch (error) {
          console.warn(`[OpenRouterProvider] Error con el modelo ${modelo}: ${error.message}. Intentando fallback si está disponible...`);
          ultimoError = error;
          // Continúa el bucle e intenta con el siguiente modelo de la lista
        }
      }

      // Si todos los modelos fallaron, lanzar el último error encontrado
      throw new Error(`Todos los modelos configurados en OpenRouter fallaron. Último error: ${ultimoError?.message}`);
    } catch (error) {
      console.error(`[OpenRouterProvider] Error crítico en la solicitud: ${error.message}`);
      throw error;
    }
  }
}

module.exports = OpenRouterProvider;
