const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../memory.db');
const db = new Database(dbPath);

const contentBlocks = db.prepare("SELECT key, value, value_en, value_de, value_ca FROM content_blocks").all();

const missing = contentBlocks.filter(row => !row.value_en || !row.value_de || !row.value_ca);

console.log(`Total missing: ${missing.length}`);
missing.slice(0, 10).forEach(row => {
  console.log(`Key: ${row.key}`);
  console.log(`  ES: ${row.value}`);
  console.log(`  EN: ${row.value_en || '[MISSING]'}`);
  console.log(`  DE: ${row.value_de || '[MISSING]'}`);
  console.log(`  CA: ${row.value_ca || '[MISSING]'}`);
});

db.close();
