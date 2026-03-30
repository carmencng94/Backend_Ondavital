// Model: SalaModel.js
// Propósito: Gestionar el catálogo de salas. Todos los campos se leen desde ContentModel (DB).

const ContentModel = require('./ContentModel');

// IDs canónicos de las salas y su clave DB correspondiente (Reflejando la nueva información)
const SALA_IDS = [
  { 
    id: 'jardin',       
    dbKey: 'sala_jardin',        
    imagenes: ['/assets/images/Yoga.jpg', '/assets/images/_DSC3953.JPG', '/assets/images/Sala abajo.jpg'] 
  },
  { 
    id: 'azul',         
    dbKey: 'sala_azul',           
    imagenes: ['/assets/images/Sala Azul.jpg'] 
  },
  { 
    id: 'despacho-plus',
    dbKey: 'sala_despacho_plus',  
    imagenes: ['/assets/images/IMG_20250102_122030.jpg', '/assets/images/IMG_20250102_122217.jpg'] 
  },
  { 
    id: 'terapia-a',    
    dbKey: 'sala_terapia_a',      
    imagenes: ['/assets/images/Sala Amarilla better.jpg', '/assets/images/GOPR4934.JPG', '/assets/images/20190115_112331.jpg', '/assets/images/IMG_20250102_122411.jpg'] 
  },
  { 
    id: 'terapia-b',    
    dbKey: 'sala_terapia_b',      
    imagenes: ['/assets/images/IMG_20250102_122509.jpg', '/assets/images/Capture.PNG', '/assets/images/RETOCADA3.jpg', '/assets/images/GOPR4960.JPG'] 
  },
  { 
    id: 'comunitaria',  
    dbKey: 'sala_comunitaria',    
    imagenes: ['/assets/images/Terraza.jpg', '/assets/images/GOPR4944.JPG'] 
  },
];

class SalaModel {
  static obtenerTodas() {
    try {
      const dbAll = ContentModel.obtenerTodos();
      const db = dbAll.es || dbAll; 

      const getImgs = (dbKey, defaultFallback) => {
        // Si el admin subió imágenes separadas por coma, usarlas
        if (db[`${dbKey}_imagenes`]) {
          return db[`${dbKey}_imagenes`].split(',').map(s => s.trim()).filter(Boolean);
        }
        return defaultFallback;
      };

      return [
        { 
          id: 'jardin', dbKey: 'sala_jardin', 
          imagenes: getImgs('sala_jardin', ['/assets/images/sala-jardin-enhanced.jpg', '/assets/images/sala-jardin-real.jpg']) 
        },
        { 
          id: 'azul', dbKey: 'sala_azul', 
          imagenes: getImgs('sala_azul', ['/assets/images/sala-azul-enhanced.jpg', '/assets/images/sala-azul-real.jpg']) 
        },
        { 
          id: 'despacho-plus', dbKey: 'sala_despacho_plus', 
          imagenes: getImgs('sala_despacho_plus', ['/assets/images/despacho-plus-enhanced.jpg', '/assets/images/despacho-plus-real.jpg']) 
        },
        { 
          id: 'terapia-a', dbKey: 'sala_terapia_a', 
          imagenes: getImgs('sala_terapia_a', ['/assets/images/sala-terapia-a-enhanced.jpg', '/assets/images/sala-terapia-a-real.jpg']) 
        },
        { 
          id: 'terapia-b', dbKey: 'sala_terapia_b', 
          imagenes: getImgs('sala_terapia_b', ['/assets/images/sala-terapia-b-enhanced.jpg', '/assets/images/sala-terapia-b-real.jpg']) 
        },
        { 
          id: 'comunitaria', dbKey: 'sala_comunitaria', 
          imagenes: getImgs('sala_comunitaria', []) 
        }
      ].map(({ id, dbKey, imagenes }) => ({
        id,
        dbKey,
        imagenes,
        nombre:         db[`${dbKey}_nombre`]          || id,
        dimensiones:    db[`${dbKey}_dimensiones`]     || '',
        capacidad:      db[`${dbKey}_capacidad`]       || '',
        descripcionLarga: db[`${dbKey}_desc`]          || '',
        equipamiento:   (db[`${dbKey}_equipo`] || '').split(',').map(s => s.trim()).filter(Boolean),
        tarifas: {
          hora:    db[`${dbKey}_tarifa_hora`]    || 'Consultar',
          dia:     db[`${dbKey}_tarifa_dia`]     || 'Consultar',
          bono:    db[`${dbKey}_tarifa_bono`]    || '',
          mensual: db[`${dbKey}_tarifa_mensual`] || '',
        }
      }));
    } catch (e) {
      console.error('Error al construir salas desde ContentModel:', e);
      return [];
    }
  }
}

module.exports = SalaModel;
