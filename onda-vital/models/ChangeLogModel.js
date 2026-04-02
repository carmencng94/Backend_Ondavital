const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || './memory.db';
const db = new Database(dbPath);

// Tabla de auditoria:
// guarda quien hizo que accion y cuando, para trazabilidad y soporte.
db.exec(`
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_name TEXT,
    action TEXT NOT NULL,
    target_key TEXT,
    old_value TEXT,
    new_value TEXT,
    ip_address TEXT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

class ChangeLogModel {
  static registrar({ adminName = 'admin', action, targetKey = null, oldValue = null, newValue = null, ip = null }) {
    // Registro simple, siempre con timestamp para orden temporal.
    const stmt = db.prepare(`
      INSERT INTO audit_log (admin_name, action, target_key, old_value, new_value, ip_address, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(
      adminName,
      action,
      targetKey,
      oldValue,
      newValue,
      ip,
      new Date().toISOString()
    );
  }

  static obtenerRecientes(limit = 50) {
    // Limite acotado para evitar respuestas gigantes por error.
    const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
    const stmt = db.prepare(`
      SELECT id, admin_name, action, target_key, old_value, new_value, ip_address, timestamp
      FROM audit_log
      ORDER BY timestamp DESC
      LIMIT ?
    `);
    return stmt.all(safeLimit);
  }
}

module.exports = ChangeLogModel;