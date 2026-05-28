// scratch/sync_database.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../memory.db');
const db = new Database(dbPath);

console.log("Iniciando migración y limpieza de base de datos...");

// 1. Eliminar llaves obsoletas (quiropráctica)
const obsoleteKeys = [
  'home_hero_title',
  'home_hero_subtitle',
  'home_glass_p1',
  'home_glass_p2',
  'home_cta_title',
  'home_cta_desc',
  'home_cta_tagline'
];

const deleteStmt = db.prepare('DELETE FROM content_blocks WHERE key = ?');
obsoleteKeys.forEach(k => {
  const info = deleteStmt.run(k);
  if (info.changes > 0) {
    console.log(`❌ Llave obsoleta eliminada de la DB: ${k}`);
  }
});

// 2. Insertar llaves correctas enfocadas en alquiler de salas
const newDefaults = {
  'home_hero_main': 'Espacios para Crecer',
  'home_hero_sub': 'Tu evento o terapia en el mejor entorno de Onda Vital',
  'home_glass_1': 'Alquiler de salas equipadas y gestionadas para tu éxito.',
  'home_glass_2': 'Encuentra el lugar perfecto para tu propósito.',
  'home_cta_title_alt': 'Un Espacio para Cada Necesidad',
  'home_cta_desc_alt': 'Además de nuestras salas, colaboramos con profesionales externos para ofrecerte un bienestar integral.',
  'home_cta_deawakening': '✦ Visita Deawakening - Nuestra plataforma aliada'
};

const insertStmt = db.prepare(`
  INSERT INTO content_blocks (key, value, type, updated_at)
  VALUES (?, ?, 'text', ?)
  ON CONFLICT(key) DO UPDATE SET
    value = CASE WHEN value IS NULL OR value = '' OR value LIKE 'Tu cuerpo%' OR value LIKE 'Nuestro Enfoque%' THEN excluded.value ELSE value END,
    updated_at = excluded.updated_at
`);

for (const [key, value] of Object.entries(newDefaults)) {
  const info = insertStmt.run(key, value, new Date().toISOString());
  console.log(`✔️ Sincronizada llave correcta en la DB: ${key} -> "${value.substring(0, 40)}..."`);
}

console.log("Migración de base de datos completada con éxito.");
db.close();
