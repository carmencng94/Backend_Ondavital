// Model: ReservaModel.js
// Propósito: Almacenar y gestionar las reservas utilizando SQLite.

const Database = require('better-sqlite3');
const path = require('path');
const { encryptData, decryptData } = require('../utils/crypto');

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
    estado TEXT NOT NULL DEFAULT 'pendiente',
    createdAt TEXT NOT NULL
  )
`);

// Migración: Asegurarse de que la columna 'estado' existe para bases de datos ya creadas
try {
  const tableInfo = db.pragma('table_info(reservas)');
  const hasEstado = tableInfo.some(col => col.name === 'estado');
  if (!hasEstado) {
    db.exec("ALTER TABLE reservas ADD COLUMN estado TEXT NOT NULL DEFAULT 'pendiente'");
    console.log("Migración: Columna 'estado' añadida a la tabla 'reservas'.");
  }
} catch (error) {
  console.error("Error durante la migración de la base de datos:", error.message);
}

class ReservaModel {
  /**
   * Guarda una nueva pre-reserva en la base de datos SQLite con estado pendiente.
   * @param {Object} reservaData - { id?, nombre, sala, fecha, horario, contacto }
   * @returns {Object} La reserva guardada
   */
  static guardar(reservaData) {
    const nuevaReserva = {
      id: reservaData.id || Date.now().toString(),
      nombre: reservaData.nombre,
      sala: reservaData.sala,
      fecha: reservaData.fecha,
      horario: reservaData.horario,
      contacto: encryptData(reservaData.contacto || ''),
      estado: 'pendiente',
      createdAt: new Date().toISOString()
    };
    
    // Primero verificamos si la columna contacto existe (migración rápida si no)
    try {
      db.exec("ALTER TABLE reservas ADD COLUMN contacto TEXT");
    } catch (e) {
      // Ignorar si ya existe
    }

    const stmt = db.prepare('INSERT INTO reservas (id, nombre, sala, fecha, horario, contacto, estado, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(
      nuevaReserva.id, 
      nuevaReserva.nombre, 
      nuevaReserva.sala, 
      nuevaReserva.fecha, 
      nuevaReserva.horario, 
      nuevaReserva.contacto,
      nuevaReserva.estado,
      nuevaReserva.createdAt
    );
    
    return nuevaReserva;
  }

  /**
   * Actualiza el estado de una reserva.
   */
  static actualizarEstado(id, nuevoEstado) {
    const stmt = db.prepare('UPDATE reservas SET estado = ? WHERE id = ?');
    return stmt.run(nuevoEstado, id);
  }

  /**
   * Busca una reserva por ID.
   */
  static obtenerPorId(id) {
    const stmt = db.prepare('SELECT * FROM reservas WHERE id = ?');
    return stmt.get(id);
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
   * Considera ocupada si hay una reserva confirmada o pendiente.
   */
  static verificarDisponibilidad(sala, fecha, horario) {
    const stmt = db.prepare("SELECT COUNT(*) as count FROM reservas WHERE sala = ? AND fecha = ? AND horario = ? AND estado != 'rechazada'");
    const result = stmt.get(sala, fecha, horario);
    return result.count === 0;
  }

  /**
   * Obtiene una reserva y descifra su contacto (para mostrar a David)
   */
  static obtenerContactoDesencriptado(id) {
    const reserva = this.obtenerPorId(id);
    if (!reserva) return null;
    return {
      ...reserva,
      contacto_real: decryptData(reserva.contacto)
    };
  }
}

module.exports = ReservaModel;
