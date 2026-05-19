const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || './memory.db';

class BookRetrievalService {
  /**
   * Busca los fragmentos más relevantes del libro según la consulta del usuario.
   * @param {string} query - Consulta del usuario
   * @param {number} maxResults - Cantidad máxima de fragmentos a retornar
   * @returns {array} Lista de fragmentos encontrados {page_num, content}
   */
  static buscar(query, maxResults = 3) {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return [];
    }

    let db;
    try {
      db = new Database(dbPath);
      // Obtener todos los chunks
      const chunks = db.prepare("SELECT page_num, content FROM book_chunks").all();
      
      if (chunks.length === 0) {
        return [];
      }

      // Tokenizar y normalizar las palabras clave de la consulta del usuario
      const palabras = query.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'¿?¡!]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 3) // Filtrar conectores cortos
        // Stopwords comunes en español
        .filter(w => !['para', 'como', 'este', 'esta', 'pero', 'bien', 'todo', 'sobre', 'libro', 'manual', 'tienen', 'tiene', 'donde', 'cuando', 'quien', 'reserva', 'reservar', 'habitacion', 'sala', 'contacto', 'hola', 'adios', 'favor', 'onda', 'vital'].includes(w));

      if (palabras.length === 0) {
        return [];
      }

      // Calcular coincidencia y relevancia
      const chunksPuntuados = chunks.map(chunk => {
        const contenidoLower = chunk.content.toLowerCase();
        let score = 0;
        
        for (const palabra of palabras) {
          if (contenidoLower.includes(palabra)) {
            // Frecuencia de la palabra en el fragmento
            const matches = contenidoLower.split(palabra).length - 1;
            score += matches * 2; // Mayor peso por repetición
            
            // Coincidencia exacta de palabra completa (delimitada por espacios)
            const regexPalabra = new RegExp(`\\b${palabra}\\b`, 'i');
            if (regexPalabra.test(contenidoLower)) {
              score += 3; // Bonus por coincidencia de palabra exacta
            }
          }
        }

        return { chunk, score };
      });

      // Filtrar chunks con coincidencia > 0, ordenar por score descendente y retornar los mejores
      return chunksPuntuados
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(item => item.chunk);

    } catch (error) {
      console.error("Error en BookRetrievalService.buscar:", error);
      return [];
    } finally {
      if (db) {
        db.close();
      }
    }
  }
}

module.exports = BookRetrievalService;
