// Model: ReservaModel.js
// Propósito: Almacenar y gestionar las reservas utilizando SQLite.

const Database = require('better-sqlite3');
const path = require('path');

// Obtener la ruta de la DB desde var de entorno o usar fallback
const dbPath = process.env.DB_PATH || './memory.db';
const db = new Database(dbPath);

// Inicializar tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS reservas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    sala TEXT NOT NULL,
    fecha TEXT NOT NULL,
    horario TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

class ReservaModel {
  /**
   * Guarda una nueva pre-reserva en la base de datos SQLite.
   * @param {Object} reservaData - { nombre, sala, fecha, horario }
   * @returns {Object} La reserva guardada con un ID generado
   */
  static guardar(reservaData) {
    const nuevaReserva = {
      id: Date.now().toString(),
      ...reservaData,
      createdAt: new Date().toISOString()
    };
    
    const stmt = db.prepare('INSERT INTO reservas (id, nombre, sala, fecha, horario, createdAt) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(
      nuevaReserva.id, 
      nuevaReserva.nombre, 
      nuevaReserva.sala, 
      nuevaReserva.fecha, 
      nuevaReserva.horario, 
      nuevaReserva.createdAt
    );
    
    return nuevaReserva;
  }

  /**
   * Obtiene todas las pre-reservas de la base de datos.
   */
  static obtenerTodas() {
    const stmt = db.prepare('SELECT * FROM reservas ORDER BY createdAt DESC');
    return stmt.all();
  }

  /**
   * Verifica si una sala está libre en una fecha y horario específicos.
   * @param {string} sala 
   * @param {string} fecha 
   * @param {string} horario 
   * @returns {boolean}
   */
  static verificarDisponibilidad(sala, fecha, horario) {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM reservas WHERE sala = ? AND fecha = ? AND horario = ?');
    const result = stmt.get(sala, fecha, horario);
    return result.count === 0;
  }
}

module.exports = ReservaModel;
