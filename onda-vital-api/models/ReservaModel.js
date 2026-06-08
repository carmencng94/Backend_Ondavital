// Model: ReservaModel.js
// Propósito: Almacenar y gestionar las reservas utilizando SQLite.

const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const { encryptData, decryptData } = require('../utils/crypto');

// Obtener la ruta de la DB desde var de entorno o usar fallback de manera absoluta
const rawDbPath = process.env.DB_PATH || './memory.db';
const dbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(__dirname, '..', rawDbPath);
const db = new Database(dbPath);

// Inicializar tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS reservas (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    sala TEXT NOT NULL,
    fecha TEXT NOT NULL,
    horario TEXT NOT NULL,
    contacto TEXT,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    createdAt TEXT NOT NULL
  )
`);

// Migración: Asegurarse de que las columnas necesarias existen para bases de datos ya creadas
try {
  const tableInfo = db.pragma('table_info(reservas)');
  
  const hasEstado = tableInfo.some(col => col.name === 'estado');
  if (!hasEstado) {
    db.exec("ALTER TABLE reservas ADD COLUMN estado TEXT NOT NULL DEFAULT 'pendiente'");
    console.log("Migración: Columna 'estado' añadida a la tabla 'reservas'.");
  }

  const hasGoogleEventId = tableInfo.some(col => col.name === 'google_event_id');
  if (!hasGoogleEventId) {
    db.exec("ALTER TABLE reservas ADD COLUMN google_event_id TEXT");
    console.log("Migración: Columna 'google_event_id' añadida a la tabla 'reservas'.");
  }

  const hasSyncStatus = tableInfo.some(col => col.name === 'sync_status');
  if (!hasSyncStatus) {
    db.exec("ALTER TABLE reservas ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'local'");
    console.log("Migración: Columna 'sync_status' añadida a la tabla 'reservas'.");
  }

  const hasPrecio = tableInfo.some(col => col.name === 'precio');
  if (!hasPrecio) {
    db.exec("ALTER TABLE reservas ADD COLUMN precio REAL DEFAULT 0");
    console.log("Migración: Columna 'precio' añadida a la tabla 'reservas'.");
  }
} catch (error) {
  console.error("Error durante la migración de la base de datos:", error.message);
}

const generarTrackingId = () => {
  const prefijo = 'OV';
  const fecha = new Date().toISOString().slice(2,10).replace(/-/g,''); // YYYYMMDD
  const aleatorio = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars hex
  return `${prefijo}-${fecha}-${aleatorio}`;
};

class ReservaModel {
  /**
   * Guarda una nueva pre-reserva en la base de datos SQLite con estado pendiente.
   * @param {Object} reservaData - { id?, nombre, sala, fecha, horario, contacto }
   * @returns {Object} La reserva guardada
   */
  static guardar(reservaData) {
    const nuevaReserva = {
      id: reservaData.id || generarTrackingId(),
      nombre: reservaData.nombre,
      sala: reservaData.sala,
      fecha: reservaData.fecha,
      horario: reservaData.horario,
      contacto: encryptData(reservaData.contacto || ''),
      estado: 'pendiente',
      createdAt: new Date().toISOString(),
      precio: reservaData.precio || 0
    };
    
    // Primero verificamos si la columna contacto existe (migración rápida si no)
    try {
      db.exec("ALTER TABLE reservas ADD COLUMN contacto TEXT");
    } catch (e) {
      // Ignorar si ya existe
    }

    const stmt = db.prepare('INSERT INTO reservas (id, nombre, sala, fecha, horario, contacto, estado, createdAt, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(
      nuevaReserva.id, 
      nuevaReserva.nombre, 
      nuevaReserva.sala, 
      nuevaReserva.fecha, 
      nuevaReserva.horario, 
      nuevaReserva.contacto,
      nuevaReserva.estado,
      nuevaReserva.createdAt,
      nuevaReserva.precio
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
   * Vincula una reserva local con su evento creado en Google Calendar.
   */
  static vincularEventoCalendar(id, eventId, syncStatus = 'synced') {
    const stmt = db.prepare('UPDATE reservas SET google_event_id = ?, sync_status = ? WHERE id = ?');
    return stmt.run(eventId, syncStatus, id);
  }

  /**
   * Actualiza la fecha y el horario de una reserva a partir de los datos del calendario.
   */
  static reprogramarReserva(id, nuevaFecha, nuevoHorario) {
    const stmt = db.prepare('UPDATE reservas SET fecha = ?, horario = ?, sync_status = ? WHERE id = ?');
    return stmt.run(nuevaFecha, nuevoHorario, 'synced', id);
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
   * Obtiene las reservas asociadas a un conjunto específico de fechas.
   * @param {string[]} fechasArray - Array de fechas en formato AAAA-MM-DD
   */
  static obtenerPorFechas(fechasArray) {
    if (!fechasArray || fechasArray.length === 0) return [];
    const placeholders = fechasArray.map(() => '?').join(',');
    const stmt = db.prepare(`SELECT * FROM reservas WHERE fecha IN (${placeholders}) ORDER BY createdAt DESC`);
    return stmt.all(...fechasArray);
  }

  /**
   * Obtiene las reservas en un rango de fechas inclusive.
   * @param {string} fechaInicio - Fecha de inicio en formato AAAA-MM-DD
   * @param {string} fechaFin - Fecha de fin en formato AAAA-MM-DD
   */
  static obtenerPorRangoFechas(fechaInicio, fechaFin) {
    const stmt = db.prepare('SELECT * FROM reservas WHERE fecha >= ? AND fecha <= ? ORDER BY createdAt DESC');
    return stmt.all(fechaInicio, fechaFin);
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

  /**
   * Busca una reserva existente que coincida en nombre, sala, fecha y horario.
   * Esto previene el error de auto-solapamiento cuando el usuario vuelve a pedir el enlace.
   */
  static obtenerExistente(nombre, sala, fecha, horario) {
    const stmt = db.prepare("SELECT * FROM reservas WHERE fecha = ? AND horario = ? AND estado != 'rechazada'");
    const reservas = stmt.all(fecha, horario);

    const cleanStr = (str) => {
      if (!str) return '';
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    };

    const targetNombreClean = cleanStr(nombre);
    const targetSalaClean = cleanStr(sala);

    for (const res of reservas) {
      if (cleanStr(res.nombre) === targetNombreClean && cleanStr(res.sala) === targetSalaClean) {
        return {
          ...res,
          contacto_real: decryptData(res.contacto)
        };
      }
    }
    return null;
  }
}

module.exports = ReservaModel;

