const Database = require('better-sqlite3');
const path = require('path');
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'memory.db');
const db = new Database(dbPath);

// Inicializar tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS ai_feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_message TEXT,
    ai_response TEXT,
    feedback_text TEXT,
    ip_address TEXT,
    is_resolved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

class FeedbackModel {
  static create({ userMessage, aiResponse, feedbackText, ipAddress }) {
    const stmt = db.prepare(`
      INSERT INTO ai_feedbacks (user_message, ai_response, feedback_text, ip_address)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(userMessage || '', aiResponse || '', feedbackText || '', ipAddress || '');
  }

  static getUnresolved() {
    const stmt = db.prepare(`
      SELECT * FROM ai_feedbacks 
      WHERE is_resolved = 0 
      ORDER BY created_at DESC
    `);
    return stmt.all();
  }

  static resolve(id) {
    // Marcamos como resuelto (o lo borramos directamente. El usuario prefirió borrarlo para mantener BD limpia).
    // Para mayor limpieza, lo borraremos físicamente.
    const stmt = db.prepare(`DELETE FROM ai_feedbacks WHERE id = ?`);
    return stmt.run(id);
  }

  static deleteAll(ids) {
    if (!ids || !ids.length) return { changes: 0 };
    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`DELETE FROM ai_feedbacks WHERE id IN (${placeholders})`);
    return stmt.run(...ids);
  }
}

module.exports = FeedbackModel;
