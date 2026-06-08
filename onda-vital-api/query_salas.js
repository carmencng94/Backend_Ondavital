const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'memory.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, dbKey, nombre FROM salas", (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(rows, null, 2));
    db.close();
});
