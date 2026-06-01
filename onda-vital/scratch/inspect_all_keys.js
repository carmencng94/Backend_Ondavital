const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../memory.db');
const db = new Database(dbPath);

const contentBlocks = db.prepare("SELECT key, value, value_en, value_de, value_ca FROM content_blocks").all();

console.log(`Total content blocks in DB: ${contentBlocks.length}`);
contentBlocks.forEach(row => {
  if (!row.value_en || !row.value_de || !row.value_ca) {
    console.log(`Missing key: ${row.key}`);
    console.log(`  ES: "${row.value}"`);
    console.log(`  EN: "${row.value_en}"`);
    console.log(`  DE: "${row.value_de}"`);
    console.log(`  CA: "${row.value_ca}"`);
  }
});

db.close();
