const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../memory.db');
const db = new Database(dbPath);

console.log("=== LISTADO DE RESERVAS EN SQLite ===");
try {
  const rows = db.prepare("SELECT * FROM reservas ORDER BY createdAt DESC").all();
  console.log(`Total de reservas registradas: ${rows.length}\n`);
  
  if (rows.length === 0) {
    console.log("No hay reservas.");
  } else {
    rows.forEach(r => {
      console.log(`ID:      ${r.id}`);
      console.log(`Nombre:  ${r.nombre}`);
      console.log(`Sala:    ${r.sala}`);
      console.log(`Fecha:   ${r.fecha}`);
      console.log(`Horario: ${r.horario}`);
      console.log(`Estado:  ${r.estado}`);
      console.log(`GCal ID: ${r.google_event_id || 'NO SINCRONIZADA'}`);
      console.log(`Sync:    ${r.sync_status || 'N/A'}`);
      console.log("-----------------------------------------");
    });
  }
} catch (err) {
  console.error("Error consultando la tabla 'reservas':", err.message);
}

db.close();
