// Model: ContentModel.js
// Propósito: Almacenar y gestionar los bloques de contenido de la web utilizando SQLite.

const Database = require('better-sqlite3');
const path = require('path');

// Obtener la ruta de la DB desde var de entorno o usar fallback
const dbPath = process.env.DB_PATH || './memory.db';
const db = new Database(dbPath);

// Inicializar tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS content_blocks (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    type TEXT,
    updated_at TEXT
  )
`);

// Insertar contenido de prueba inicial si la tabla está vacía
try {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM content_blocks');
  const result = stmt.get();
  if (result.count < 10) { // Si hay menos de 10 claves, re-poblamos con las base
    console.log("Insertando o sincronizando textos predeterminados en 'content_blocks'...");
    const insertStmt = db.prepare('INSERT OR IGNORE INTO content_blocks (key, value, type, updated_at) VALUES (?, ?, ?, ?)');
    
    const defaults = {
      // Home
      'home_hero_title': 'Nuestro Enfoque Eres Tú',
      'home_hero_subtitle': 'Vuelve a conectar con tu vitalidad natural',
      'home_glass_p1': 'Tu cuerpo tiene una capacidad innata de mantenerse sano',
      'home_glass_p2': 'Estamos aquí para ayudarte a recuperarla.',
      'home_intro_title': 'Entendiendo el Desequilibrio',
      'home_intro_desc': 'La vida diaria está llena de fuentes de estrés que interfieren con tu bienestar:',
      'home_stress_1': 'Estrés Físico (posturas, lesiones)',
      'home_stress_2': 'Estrés Mental (bloqueos, preocupaciones)',
      'home_stress_3': 'Estrés Emocional (tensiones acumuladas)',
      'home_stress_conc': 'Estas interferencias resultan en dolor, disfunción y malestar.',
      'home_cta_title': 'Restaura tu habilidad de sanar',
      'home_cta_desc': 'En Onda Vital trabajamos para que puedas disfrutar de una vida plena y libre de limitaciones.',
      'home_cta_tagline': 'Mereces disfrutar de tu vida',
      // Contacto
      'contacto_telefono': '601 39 21 61',
      'contacto_email': 'info@ondavitalholistic.com',
      'contacto_direccion': 'c/ Martí Boneo, 31 bajos, 07013 Palma de Mallorca (Son Dameto)',
      'contacto_horarios_q1': 'Lunes y Miércoles: 17:30 - 20h',
      'contacto_horarios_q2': 'Martes y Jueves: 10:30 - 13h',
      // Quiro
      'quiro_title': 'Quiropráctica',
      'quiro_subtitle': '¡No hay que estar mal para estar mejor!',
      'quiro_intro_1': 'La Quiropráctica es una profesión sanitaria reconocida en la mayoría de países desarrollados del mundo. Se trata de mejorar la capacidad del cuerpo de curarse y mantenerse sano.',
      'quiro_intro_2': 'La gente acude al quiropráctico por muchas razones, entre ellas:',
      'quiro_dea_title': 'DEA - Deep Energetic Awakening',
      'quiro_dea_desc': 'Basada en Network Spinal Analysis, es una técnica avanzada y a la vez muy suave. Ayuda a que el cuerpo aprenda a reconocer y corregir patrones de tensión.',
      'quiro_resosense_desc': 'Práctica personal desarrollada por David Biddle aquí en Mallorca. Utiliza la resonancia estructural del cuerpo para equilibrar y mejorar tu ser.',
      // Resosense
      'reso_title': 'Resosense',
      'reso_subtitle': 'Una suave práctica de movimiento personal para un cambio profundo.',
      'reso_question': '¿Qué es Resosense?',
      'reso_answer_1': 'Resosense es una práctica personal en la que utilizas tus propios músculos para generar ondas de resonancia en tu cuerpo.',
      'reso_origen_title': 'Nuestros Orígenes',
      'reso_origen_desc': 'A partir de 2006, David reconoció por primera vez la existencia de frecuencias específicas de movimiento ondulatorio u oscilación en el cuerpo.',
      // Footer
      'footer_desc': 'Centro de bienestar y técnicas manuales para tu salud integral.',
      'footer_copyright': '© 1996- 2025 Onda Vital Holistic. All Rights Reserved.'
    };
    
    for (const [key, value] of Object.entries(defaults)) {
      insertStmt.run(key, value, 'text', new Date().toISOString());
    }
  }
} catch (error) {
  console.error("Error sincronizando content_blocks inicial:", error.message);
}

class ContentModel {
  /**
   * Obtiene todos los bloques de contenido formateados como un objeto { clave: valor }.
   */
  static obtenerTodos() {
    const stmt = db.prepare('SELECT key, value FROM content_blocks');
    const rows = stmt.all();
    
    // Convertir el array de filas en un objeto { "home_hero_title": "Valor..." }
    const contentObject = {};
    rows.forEach(row => {
      contentObject[row.key] = row.value;
    });
    
    return contentObject;
  }

  /**
   * Actualiza el valor de un bloque de contenido existente.
   */
  static actualizarValor(key, newValue) {
    const stmt = db.prepare('UPDATE content_blocks SET value = ?, updated_at = ? WHERE key = ?');
    return stmt.run(newValue, new Date().toISOString(), key);
  }
}

module.exports = ContentModel;
