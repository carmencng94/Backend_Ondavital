/**
 * ChatGateway.js
 * Orquestador de proveedores de chat con soporte para fallback
 * Maneja la lógica de enrutamiento entre múltiples proveedores
 */

class ChatGateway {
  constructor(config = {}) {
    this.mainProvider = config.provider || null;
    this.fallbackProvider = config.fallbackProvider || null;
    
    if (!this.mainProvider) {
      throw new Error('ChatGateway requiere al menos un proveedor principal');
    }
  }

  /**
   * Obtiene respuesta de chat con fallback automático
   * @param {string} mensaje - Mensaje del usuario
   * @param {array} historial - Historial de conversación
   * @param {string} idioma - Idioma de la respuesta (es, en, de, ca)
   * @param {string} context - Contexto (public, admin)
   * @returns {Promise<object>} Objeto con respuesta, idioma, proveedor usado y timestamp
   */
  async obtenerRespuesta(mensaje, historial = [], idioma = 'es', context = 'public') {
    const timestamp = new Date().toISOString();
    
    try {
      // Intentar con el proveedor principal
      console.log(`[ChatGateway] Usando proveedor principal: ${this.mainProvider.constructor.name}`);
      
      const respuesta = await this.mainProvider.obtenerRespuesta(
        mensaje,
        historial,
        idioma,
        context
      );
      
      return {
        respuesta: respuesta.respuesta || respuesta,
        idioma: idioma,
        proveedor: this.mainProvider.constructor.name,
        timestamp: timestamp,
      };
    } catch (error) {
      console.error(`[ChatGateway] Error con proveedor principal: ${error.message}`);
      
      // Si hay fallback y el principal falló, usar fallback
      if (this.fallbackProvider) {
        try {
          console.log(`[ChatGateway] Intentando con fallback: ${this.fallbackProvider.constructor.name}`);
          
          const respuesta = await this.fallbackProvider.obtenerRespuesta(
            mensaje,
            historial,
            idioma,
            context
          );
          
          return {
            respuesta: respuesta.respuesta || respuesta,
            idioma: idioma,
            proveedor: `${this.mainProvider.constructor.name}(fallback:${this.fallbackProvider.constructor.name})`,
            timestamp: timestamp,
          };
        } catch (fallbackError) {
          console.error(`[ChatGateway] Error con fallback: ${fallbackError.message}`);
          throw new Error(`Todos los proveedores fallaron. Principal: ${error.message}. Fallback: ${fallbackError.message}`);
        }
      }
      
      throw error;
    }
  }

  /**
   * Cambia el proveedor principal en tiempo de ejecución
   * @param {object} nuevoProveedor - Nueva instancia de proveedor
   */
  cambiarProveedor(nuevoProveedor) {
    if (!nuevoProveedor) {
      throw new Error('El nuevo proveedor no puede ser nulo');
    }
    this.mainProvider = nuevoProveedor;
    console.log(`[ChatGateway] Proveedor cambiado a: ${nuevoProveedor.constructor.name}`);
  }

  /**
   * Obtiene información del proveedor actual
   * @returns {object} Información del proveedor
   */
  obtenerInfoProveedor() {
    return {
      principal: this.mainProvider?.constructor.name || 'No definido',
      fallback: this.fallbackProvider?.constructor.name || 'No definido',
    };
  }
}

module.exports = ChatGateway;
