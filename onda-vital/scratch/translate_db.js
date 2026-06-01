const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const axios = require('axios');

// Cargar variables de entorno desde la ruta correcta
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbPath = path.resolve(__dirname, '../memory.db');

if (!fs.existsSync(dbPath)) {
  console.error(`Base de datos no encontrada en: ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath);

// Configuración de API
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error("Error: OPENROUTER_API_KEY no está configurada en el archivo .env");
  process.exit(1);
}

// Obtener el primer modelo de la lista de OpenRouter (default: google/gemini-2.5-flash-lite)
const modelsConfig = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash-lite';
const model = modelsConfig.split(',')[0].trim();
const apiURL = 'https://openrouter.ai/api/v1/chat/completions';

console.log(`Usando modelo de traducción: ${model}`);

// Lista de términos en lista blanca que no deben traducirse
const WHITELIST = [
  'Onda Vital', 'Onda Vital Holistic', 'Martí Boneo', 'Son Dameto',
  'David', 'David Biddle', 'WhatsApp', 'DEAwakening', 'Deawakening',
  'Resosense', 'NSA', 'Network Spinal Analysis', 'DVQR',
  'info@ondavitalholistic.com', '601 39 21 61'
];

// Comprobar si un valor es estático/copiable directamente (imágenes, emails, teléfonos, etc.)
function isStaticOrCopiable(text) {
  if (!text) return true;
  const t = text.trim();
  if (!t) return true;

  // Teléfono o símbolos numéricos
  if (/^[0-9\s€$:\-\+\/\*.,()&%#@!¡?¿]+$/.test(t)) return true;

  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return true;

  // Rutas de archivos o URLs
  if (
    t.startsWith('/') ||
    t.startsWith('http://') ||
    t.startsWith('https://') ||
    t.includes('.png') ||
    t.includes('.jpg') ||
    t.includes('.jpeg') ||
    t.includes('.webp') ||
    t.includes('.gif')
  ) {
    return true;
  }

  return false;
}

async function translateBatch(batch) {
  const payloadItems = {};
  
  batch.forEach(item => {
    payloadItems[item.key] = item.value;
  });

  const prompt = `You are a high-quality human translator for a premium wellness center called "Onda Vital".
Translate the following dynamic content blocks from Spanish (ES) into:
- English (EN)
- German (DE)
- Catalan (CA)

Input blocks to translate (JSON format):
${JSON.stringify(payloadItems, null, 2)}

CRITICAL RULES:
1. Return ONLY a valid JSON object mapping each key to an object with "en", "de", and "ca" translations.
Example format:
{
  "key_name": {
    "en": "translated text in English",
    "de": "translated text in German",
    "ca": "translated text in Catalan"
  }
}
2. Keep any HTML format tags intact (e.g. ✦, ↗, <b>, <i>, <br>, etc.).
3. Maintain variables or placeholders like {{FECHA_ACTUAL}}, {{RESERVAS_OCUPADAS}} exactly as they are.
4. Respect brand names: "Onda Vital", "Son Dameto", "David", "DEAwakening", "Resosense", "NSA", "Network Spinal Analysis" exactly as written.
5. If the input text is empty, the translations must be empty strings.
6. Do NOT include markdown code fences (like \`\`\`json) in your final response. Return only the raw JSON.`;

  try {
    const response = await axios.post(apiURL, {
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert translator. You output only raw, valid JSON as instructed without markdown wrappers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_REFERER || 'https://ondavital.com'
      }
    });

    let content = response.data.choices[0].message.content.trim();
    
    // Quitar markdown json wrappers si el modelo los añade a pesar de las instrucciones
    if (content.startsWith('```')) {
      content = content.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error(`Error llamando a la API en el lote:`, error.message);
    if (error.response && error.response.data) {
      console.error(JSON.stringify(error.response.data));
    }
    throw error;
  }
}

async function startTranslation() {
  console.log("=== INICIANDO TRADUCCIÓN AUTOMÁTICA EN SQLite ===");
  
  // 1. Obtener claves faltantes
  const contentBlocks = db.prepare("SELECT key, value, value_en, value_de, value_ca FROM content_blocks").all();
  const missing = contentBlocks.filter(row => !row.value_en || !row.value_de || !row.value_ca);
  
  console.log(`Claves totales en base de datos: ${contentBlocks.length}`);
  console.log(`Claves faltantes a procesar: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log("✅ ¡No hay claves faltantes! Base de datos 100% traducida.");
    db.close();
    process.exit(0);
  }

  // 2. Separar estáticas y dinámicas
  const staticItems = [];
  const dynamicItems = [];

  missing.forEach(row => {
    if (isStaticOrCopiable(row.value)) {
      staticItems.push(row);
    } else {
      dynamicItems.push(row);
    }
  });

  console.log(`- Claves estáticas/copiables detectadas (imágenes, urls, números): ${staticItems.length}`);
  console.log(`- Claves dinámicas de texto para traducir vía IA: ${dynamicItems.length}\n`);

  // 3. Procesar las estáticas directamente en una transacción
  if (staticItems.length > 0) {
    console.log("Copiando claves estáticas/copiables...");
    const updateStmt = db.prepare('UPDATE content_blocks SET value_en = ?, value_de = ?, value_ca = ?, updated_at = ? WHERE key = ?');
    
    const staticTransaction = db.transaction((items) => {
      for (const item of items) {
        const val = item.value || '';
        updateStmt.run(val, val, val, new Date().toISOString(), item.key);
      }
    });

    staticTransaction(staticItems);
    console.log("✅ Claves estáticas copiadas con éxito.\n");
  }

  // 4. Procesar las dinámicas en lotes para la IA
  if (dynamicItems.length > 0) {
    const BATCH_SIZE = 15;
    const updateStmt = db.prepare('UPDATE content_blocks SET value_en = ?, value_de = ?, value_ca = ?, updated_at = ? WHERE key = ?');
    
    for (let i = 0; i < dynamicItems.length; i += BATCH_SIZE) {
      const batch = dynamicItems.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(dynamicItems.length / BATCH_SIZE);
      
      console.log(`Procesando lote ${batchNum}/${totalBatches} (${batch.length} claves)...`);
      
      let attempts = 0;
      let success = false;
      let translations = null;

      while (attempts < 3 && !success) {
        attempts++;
        try {
          translations = await translateBatch(batch);
          success = true;
        } catch (e) {
          console.warn(`Lote ${batchNum} falló (intento ${attempts}/3). Reintentando en 3 segundos...`);
          await new Promise(r => setTimeout(r, 3000));
        }
      }

      if (!success || !translations) {
        console.error(`❌ Lote ${batchNum} falló definitivamente. Pasando al siguiente lote.`);
        continue;
      }

      // Guardar traducciones en base de datos
      const batchTransaction = db.transaction((trans) => {
        for (const [key, langs] of Object.entries(trans)) {
          updateStmt.run(langs.en || '', langs.de || '', langs.ca || '', new Date().toISOString(), key);
        }
      });

      try {
        batchTransaction(translations);
        console.log(`✅ Lote ${batchNum} guardado en SQLite con éxito.`);
      } catch (dbErr) {
        console.error(`Error guardando lote ${batchNum} en DB:`, dbErr.message);
      }

      // Pequeño retardo entre lotes para no sobrecargar
      if (i + BATCH_SIZE < dynamicItems.length) {
        console.log("Esperando 1.5 segundos antes de enviar el siguiente lote...");
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }

  console.log("\n🎉 ¡Proceso de traducción completado!");
  db.close();
}

startTranslation().catch(err => {
  console.error("Error crítico en el proceso de traducción:", err);
  db.close();
});
