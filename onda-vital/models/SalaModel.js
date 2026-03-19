// Model: SalaModel.js
// Propósito: Gestionar el catálogo de salas. Todos los campos se leen desde ContentModel (DB).

const ContentModel = require('./ContentModel');

// IDs canónicos de las salas y su clave DB correspondiente
const SALA_IDS = [
  { id: 'jardin',       dbKey: 'sala_jardin',        imagenes: ['/assets/images/sala-jardin-enhanced.jpg', '/assets/images/sala-jardin-real.jpg'] },
  { id: 'azul',         dbKey: 'sala_azul',           imagenes: ['/assets/images/sala-azul-enhanced.jpg', '/assets/images/sala-azul-real.jpg'] },
  { id: 'despacho-plus',dbKey: 'sala_despacho_plus',  imagenes: ['/assets/images/despacho-plus-enhanced.jpg', '/assets/images/despacho-plus-real.jpg'] },
  { id: 'terapia-a',    dbKey: 'sala_terapia_a',      imagenes: ['/assets/images/sala-terapia-a-enhanced.jpg', '/assets/images/sala-terapia-a-real.jpg'] },
  { id: 'terapia-b',    dbKey: 'sala_terapia_b',      imagenes: ['/assets/images/sala-terapia-b-enhanced.jpg', '/assets/images/sala-terapia-b-real.jpg'] },
  { id: 'comunitaria',  dbKey: 'sala_comunitaria',    imagenes: ['/assets/images/sala-comunitaria.png'] },
];

class SalaModel {
  static obtenerTodas() {
    try {
      const db = ContentModel.obtenerTodos();

      return SALA_IDS.map(({ id, dbKey, imagenes }) => ({
        id,
        imagenes,
        nombre:         db[`${dbKey}_nombre`]          || id,
        dimensiones:    db[`${dbKey}_dimensiones`]     || '',
        capacidad:      db[`${dbKey}_capacidad`]       || '',
        descripcionLarga: db[`${dbKey}_desc`]          || '',
        // Equipamiento almacenado como string separado por comas
        equipamiento:   (db[`${dbKey}_equipo`] || '').split(',').map(s => s.trim()).filter(Boolean),
        tarifas: {
          hora:    db[`${dbKey}_tarifa_hora`]    || '',
          dia:     db[`${dbKey}_tarifa_dia`]     || '',
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
