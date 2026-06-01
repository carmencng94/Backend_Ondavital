const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../memory.db');
const db = new Database(dbPath);

console.log("Eliminando llave obsoleta 'hero_subtitle' de la base de datos...");
const info = db.prepare("DELETE FROM content_blocks WHERE key = ?").run('hero_subtitle');
console.log(`Filas afectadas: ${info.changes}`);

db.close();
