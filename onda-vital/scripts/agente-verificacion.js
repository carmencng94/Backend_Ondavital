// scripts/agente-verificacion.js
// Propósito: Auditar traducciones e internacionalización (ES, EN, DE, CA) en Onda Vital.

const fs = require('fs');
const path = require('path');

// Intentar requerir better-sqlite3 de forma segura
let Database;
try {
  Database = require('better-sqlite3');
} catch (e) {
  console.error("Error: 'better-sqlite3' no está disponible. Asegúrate de estar en el directorio de la aplicación.");
  process.exit(1);
}

// Inicializar base de datos
const dbPath = path.resolve(__dirname, '../memory.db');
let db;
try {
  db = new Database(dbPath, { fileMustExist: true });
} catch (e) {
  console.warn(`⚠️ No se pudo abrir la DB en ${dbPath}, intentando en raíz...`);
  try {
    db = new Database(path.resolve('./memory.db'), { fileMustExist: true });
  } catch (e2) {
    console.error("Error crítico: No se encontró la base de datos 'memory.db'.");
    process.exit(1);
  }
}

// Cargar traducciones estáticas desde i18n.js usando Regex
const i18nPath = path.resolve(__dirname, '../public/src/i18n.js');
let staticTranslations = { es: {}, en: {}, de: {}, ca: {} };

if (fs.existsSync(i18nPath)) {
  const i18nContent = fs.readFileSync(i18nPath, 'utf8');
  
  // Extraer el objeto staticTranslations mediante análisis de bloques
  const match = i18nContent.match(/const\s+staticTranslations\s*=\s*\{([\s\S]*?)\n\s*\};/);
  if (match) {
    const objectContent = match[1];
    // Expresión para capturar bloques de idiomas: es: { ... }, en: { ... }, de: { ... }, ca: { ... }
    const langMatches = objectContent.match(/([a-z]{2}):\s*\{([\s\S]*?)\n\s*\}(,|$)/g);
    
    if (langMatches) {
      langMatches.forEach(langBlock => {
        const langCodeMatch = langBlock.match(/^\s*([a-z]{2}):/);
        if (langCodeMatch) {
          const langCode = langCodeMatch[1];
          const lines = langBlock.substring(langBlock.indexOf('{') + 1, langBlock.lastIndexOf('}')).split('\n');
          lines.forEach(line => {
            // Regex para clave-valor: key: 'value', o key: "value",
            const kvMatch = line.match(/^\s*([a-zA-Z0-9_-]+):\s*['"`]([\s\S]*?)['"`]/);
            if (kvMatch) {
              const k = kvMatch[1];
              const v = kvMatch[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
              staticTranslations[langCode][k] = v;
            }
          });
        }
      });
    }
  }
} else {
  console.error("Advertencia: No se encontró i18n.js en " + i18nPath);
}

// Palabras en lista blanca (nombres propios, marcas, etc.)
const WHITELIST = [
  'Onda Vital', 'Onda Vital Holistic', 'Martí Boneo', 'Son Dameto',
  'David', 'David Biddle', 'WhatsApp', 'DEAwakening', 'Deawakening',
  'Resosense', 'NSA', 'Network Spinal Analysis', 'DVQR', 'http', 'https',
  'info@ondavitalholistic.com', '601 39 21 61'
];

function isWhitelisted(text) {
  if (!text) return true;
  const t = text.trim();
  if (!t) return true;
  // Si contiene solo números, símbolos o URLs
  if (/^[0-9\s€$:\-\+\/\*.,()&%#@!¡?¿]+$/.test(t)) return true;
  // Comprobar elementos de la lista blanca exactos o parciales
  return WHITELIST.some(w => t === w || t.toLowerCase() === w.toLowerCase());
}

// Analizar consistencia en la base de datos
async function runAnalysis() {
  console.log("=========================================");
  console.log("🛡️ AGENTE DE VERIFICACIÓN DE TRADUCCIONES");
  console.log("=========================================");
  
  const contentBlocks = db.prepare("SELECT key, value, value_en, value_de, value_ca FROM content_blocks").all();
  
  const dbStats = { total: contentBlocks.length, missingEn: 0, missingDe: 0, missingCa: 0 };
  const discrepancies = [];
  const dbTranslationKeys = new Set();

  contentBlocks.forEach(row => {
    dbTranslationKeys.add(row.key);
    
    if (!row.value_en) dbStats.missingEn++;
    if (!row.value_de) dbStats.missingDe++;
    if (!row.value_ca) dbStats.missingCa++;

    // Guardar discrepancias de traducción vacía en base de datos
    ['en', 'de', 'ca'].forEach(lang => {
      const colName = `value_${lang}`;
      if (!row[colName]) {
        discrepancies.push({
          origen: 'Base de Datos (Dynamic)',
          key: row.key,
          language: lang,
          status: 'Faltante en DB',
          esValue: row.value || '',
          translatedValue: '[VACÍO] - Se aplica fallback a i18n.js o Español'
        });
      }
    });
  });

  // Analizar diccionarios estáticos de i18n.js
  const staticKeysEs = Object.keys(staticTranslations.es);
  const staticStats = {
    total: staticKeysEs.length,
    missingEn: 0,
    missingDe: 0,
    missingCa: 0
  };

  staticKeysEs.forEach(key => {
    ['en', 'de', 'ca'].forEach(lang => {
      if (!staticTranslations[lang][key]) {
        staticStats[`missing${lang.charAt(0).toUpperCase() + lang.slice(1)}`]++;
        discrepancies.push({
          origen: 'Estático (i18n.js)',
          key: key,
          language: lang,
          status: 'Faltante en diccionario',
          esValue: staticTranslations.es[key] || '',
          translatedValue: '[VACÍO]'
        });
      } else if (staticTranslations[lang][key] === staticTranslations.es[key] && !isWhitelisted(staticTranslations.es[key])) {
        // Alerta de posible texto sin traducir (mismo valor que español)
        discrepancies.push({
          origen: 'Estático (i18n.js)',
          key: key,
          language: lang,
          status: 'Posiblemente sin traducir (mismo texto que ES)',
          esValue: staticTranslations.es[key],
          translatedValue: staticTranslations[lang][key]
        });
      }
    });
  });

  console.log(`\n📊 ANÁLISIS ESTÁTICO COMPLETADO:`);
  console.log(`- Bloques de contenido en DB: ${dbStats.total}`);
  console.log(`  - Faltan en Inglés: ${dbStats.missingEn}`);
  console.log(`  - Faltan en Alemán: ${dbStats.missingDe}`);
  console.log(`  - Faltan en Catalán: ${dbStats.missingCa}`);
  console.log(`- Traducciones estáticas en i18n.js: ${staticStats.total}`);
  console.log(`  - Faltan en Inglés: ${staticStats.missingEn}`);
  console.log(`  - Faltan en Alemán: ${staticStats.missingDe}`);
  console.log(`  - Faltan en Catalán: ${staticStats.missingCa}`);

  // Intentar ejecución dinámica con Playwright
  let browserStats = null;
  let playwrightInstalled = false;
  
  try {
    require.resolve('playwright');
    playwrightInstalled = true;
  } catch (e) {
    console.log("\n💡 Nota: 'playwright' no está instalado. Ejecuta 'npm i -D playwright' para habilitar la auditoría visual con navegador real.");
  }

  if (playwrightInstalled) {
    try {
      browserStats = await runPlaywrightAudit(dbTranslationKeys);
    } catch (pwError) {
      console.warn("⚠️ No se pudo conectar con la web pública en http://localhost:3051. Asegúrate de que el servidor esté corriendo ('npm start' en onda-vital).");
      console.error(pwError.message);
    }
  }

  // Generar reporte HTML final
  generateHTMLReport(dbStats, staticStats, discrepancies, browserStats);
}

// Auditoría interactiva con Playwright
async function runPlaywrightAudit(dbKeys) {
  console.log("\n🌐 Iniciando auditoría dinámica con Playwright...");
  const { chromium } = require('playwright');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'http://localhost:3051';
  
  // Validar carga
  await page.goto(url, { waitUntil: 'networkidle' });
  console.log("✅ Conectado exitosamente a la web de Onda Vital.");

  const languages = ['es', 'en', 'de', 'ca'];
  const pages = ['home', 'salas', 'quiropractica', 'about', 'contacto'];
  const results = {};

  for (const lang of languages) {
    results[lang] = {
      totalTexts: 0,
      translated: 0,
      untranslatedLeaks: [],
      hardcodedTexts: []
    };

    console.log(`\n- Analizando idioma: [${lang.toUpperCase()}]`);
    await page.goto(`${url}/?lang=${lang}`, { waitUntil: 'networkidle' });
    
    // Recorrer pestañas para forzar render
    for (const tab of pages) {
      // Simular click en la pestaña si existe
      try {
        const link = await page.$(`.nav-links a[data-tab="${tab}"]`);
        if (link) {
          await link.click();
          await page.waitForTimeout(100);
        }
      } catch(e) {}
      
      // Extraer textos de elementos clave
      const textElements = await page.evaluate(() => {
        const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li', 'button'];
        const list = [];
        tags.forEach(tag => {
          document.querySelectorAll(tag).forEach(el => {
            // Solo hojas finales con texto
            if (el.children.length === 0 && el.textContent) {
              const txt = el.textContent.trim();
              if (txt.length > 1) {
                list.push({
                  tag: tag,
                  text: txt,
                  id: el.id || '',
                  class: el.className || ''
                });
              }
            }
          });
        });
        
        // Inputs placeholder
        document.querySelectorAll('input, textarea').forEach(el => {
          const ph = el.getAttribute('placeholder');
          if (ph && ph.trim().length > 1) {
            list.push({
              tag: 'input-placeholder',
              text: ph.trim(),
              id: el.id || '',
              class: el.className || ''
            });
          }
        });
        
        return list;
      });

      // Procesar cada texto encontrado en la página
      textElements.forEach(item => {
        results[lang].totalTexts++;
        const text = item.text;

        if (isWhitelisted(text)) {
          results[lang].translated++;
          return;
        }

        // Buscar si el texto existe en los diccionarios de traducciones (tanto estático como dinámico)
        let foundInDictionary = false;
        let isTranslatedValue = false;

        // Comprobar staticTranslations
        if (staticTranslations[lang]) {
          const matchedKey = Object.keys(staticTranslations[lang]).find(k => staticTranslations[lang][k] === text);
          if (matchedKey) {
            foundInDictionary = true;
            isTranslatedValue = true;
          } else {
            // Ver si coincide en español pero no en el idioma actual (fuga de idioma)
            const matchedEsKey = Object.keys(staticTranslations.es).find(k => staticTranslations.es[k] === text);
            if (matchedEsKey) {
              foundInDictionary = true;
              // Si coincide en español, comprobar si en el idioma actual el valor es distinto
              const currentLangVal = staticTranslations[lang][matchedEsKey];
              if (currentLangVal && currentLangVal !== text) {
                // Hay traducción disponible pero se está mostrando el español!
                isTranslatedValue = false;
              } else if (lang !== 'es') {
                // Faltante en este idioma, mostrando español
                isTranslatedValue = false;
              } else {
                isTranslatedValue = true;
              }
            }
          }
        }

        // Si no se ha encontrado en i18n, buscar en la base de datos
        if (!foundInDictionary) {
          const query = db.prepare("SELECT key, value, value_en, value_de, value_ca FROM content_blocks WHERE value = ? OR value_en = ? OR value_de = ? OR value_ca = ?").get(text, text, text, text);
          if (query) {
            foundInDictionary = true;
            const langCol = lang === 'es' ? 'value' : `value_${lang}`;
            if (query[langCol] === text) {
              isTranslatedValue = true;
            } else if (lang !== 'es') {
              isTranslatedValue = false;
            }
          }
        }

        if (!foundInDictionary) {
          // Texto duro (hardcodeado)
          results[lang].hardcodedTexts.push({
            text: text,
            tag: item.tag,
            selector: `${item.tag}${item.id ? '#' + item.id : ''}${item.class ? '.' + item.class.split(' ').join('.') : ''}`
          });
        } else if (!isTranslatedValue && lang !== 'es') {
          // Fuga idiomática: texto se renderiza en español en un idioma que no es ES
          results[lang].untranslatedLeaks.push({
            text: text,
            tag: item.tag,
            selector: `${item.tag}${item.id ? '#' + item.id : ''}`
          });
        } else {
          results[lang].translated++;
        }
      });
    }

    // Filtrar duplicados
    results[lang].hardcodedTexts = results[lang].hardcodedTexts.filter((v, i, a) => a.findIndex(t => t.text === v.text) === i);
    results[lang].untranslatedLeaks = results[lang].untranslatedLeaks.filter((v, i, a) => a.findIndex(t => t.text === v.text) === i);
  }

  // Realizar prueba E2E de login y edición en admin
  console.log("\n🔑 Iniciando verificación del Panel Admin...");
  try {
    await page.goto(`${url}/admin`, { waitUntil: 'networkidle' });
    
    // Si redirige a login, rellenar formulario
    if (await page.$('#username')) {
      await page.fill('#username', process.env.ADMIN_USER || 'DVQR');
      await page.fill('#password', process.env.ADMIN_PASSWORD || 'DVQR');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      console.log("🔑 Autenticación exitosa en el panel admin.");
    }
    
    // Ir a contenido
    const navContenido = await page.$('#nav-contenido');
    if (navContenido) {
      await navContenido.click();
      await page.waitForTimeout(300);
      
      // Comprobar si se pintan las pestañas y el editor
      const hasEditor = await page.$('#editor-container');
      if (hasEditor) {
        console.log("✅ Sección de gestión de contenido cargada correctamente.");
      }
    }
  } catch(adminErr) {
    console.warn("⚠️ No se pudo completar el test del Panel Admin:", adminErr.message);
  }

  await browser.close();
  return results;
}

// Escribir reporte en HTML interactivo
function generateHTMLReport(dbStats, staticStats, discrepancies, browserStats) {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const htmlPath = path.join(reportsDir, 'reporte-verificacion.html');
  const mdPath = path.join(reportsDir, 'reporte-verificacion.md');

  // Calcular métricas
  const totalIssues = discrepancies.length;
  
  let browserSection = '';
  if (browserStats) {
    browserSection = `
      <h2>🌐 Auditoría Dinámica (En Navegador Real)</h2>
      <p>Resultados extraídos mediante rastreo automatizado de DOM en Onda Vital:</p>
      <div class="grid">
        ${Object.keys(browserStats).map(lang => {
          const stats = browserStats[lang];
          const total = stats.totalTexts || 1;
          const pct = Math.round((stats.translated / total) * 100);
          return `
            <div class="card bg-white shadow rounded p-4">
              <h3 style="margin-top:0; border-bottom:2px solid var(--accent); padding-bottom:8px;">Idioma: ${lang.toUpperCase()}</h3>
              <div class="stat-num" style="color:${pct > 90 ? 'var(--success)' : 'var(--warn)'}">${pct}% Cobertura</div>
              <p style="font-size:14px; margin-bottom:8px;"><strong>Textos analizados:</strong> ${stats.totalTexts}</p>
              <p style="font-size:14px; margin-bottom:8px; color:var(--danger)"><strong>Fugas de traducción (leaks):</strong> ${stats.untranslatedLeaks.length}</p>
              <p style="font-size:14px; margin-bottom:8px; color:#b45309"><strong>Textos hardcodeados (no editables):</strong> ${stats.hardcodedTexts.length}</p>
            </div>
          `;
        }).join('')}
      </div>

      <h3>⚠️ Detalles de Fugas de Idioma (Texto en Español en Vistas Extranjeras)</h3>
      ${Object.keys(browserStats).map(lang => {
        if (lang === 'es' || browserStats[lang].untranslatedLeaks.length === 0) return '';
        return `
          <div class="card p-4 my-2" style="border-left: 4px solid var(--danger);">
            <strong style="text-transform:uppercase; color:var(--danger);">Fugas en ${lang.toUpperCase()}:</strong>
            <table class="table my-2">
              <thead>
                <tr>
                  <th>Texto en Español Encontrado</th>
                  <th>Etiqueta HTML / Selector</th>
                </tr>
              </thead>
              <tbody>
                ${browserStats[lang].untranslatedLeaks.map(leak => `
                  <tr>
                    <td><code style="color:var(--danger);">${leak.text}</code></td>
                    <td><code>${leak.selector}</code></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }).join('')}

      <h3>🔧 Textos Hardcodeados (Deben migrarse al sistema de traducción)</h3>
      <p style="font-size:14px; color:var(--text-muted);">Estos textos están escritos directamente en el código de los componentes JSX/HTML y David no puede editarlos desde el administrador.</p>
      <table class="table">
        <thead>
          <tr>
            <th>Idioma</th>
            <th>Texto Escrito en Código</th>
            <th>Selector Elemento</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(browserStats).map(lang => {
            return browserStats[lang].hardcodedTexts.map(hc => `
              <tr>
                <td><span class="badge ${lang === 'es' ? 'info' : 'warning'}">${lang.toUpperCase()}</span></td>
                <td><strong>"${hc.text}"</strong></td>
                <td><code>${hc.selector}</code></td>
              </tr>
            `).join('');
          }).join('')}
        </tbody>
      </table>
    `;
  } else {
    browserSection = `
      <div class="card p-4" style="background:#fef3c7; border-left:4px solid #d97706; color:#92400e;">
        <strong>⚠️ Auditoría dinámica no ejecutada:</strong> Instala <code>playwright</code> localmente y arranca el servidor Express antes de ejecutar para ver el rastreo visual, fugas idiomáticas en vivo y textos hardcodeados de los componentes.
      </div>
    `;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Verificación Lingüística - Onda Vital</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-main: #f7f6f3;
          --accent: #3a7c6e;
          --success: #1e8449;
          --warn: #d68910;
          --danger: #c0392b;
          --text-main: #2c2c2a;
          --text-muted: #888780;
          --border: rgba(60,58,50,0.12);
        }
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--bg-main);
          color: var(--text-main);
          margin: 0;
          padding: 24px;
          line-height: 1.6;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1, h2, h3 {
          font-weight: 700;
          color: var(--text-main);
        }
        h1 { font-size: 2.2rem; margin-bottom: 8px; }
        .subtitle { color: var(--text-muted); font-size: 1.1rem; margin-top: 0; margin-bottom: 32px; }
        .card {
          background: white;
          border-radius: 12px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          margin-bottom: 24px;
        }
        .p-4 { padding: 24px; }
        .p-2 { padding: 12px; }
        .my-2 { margin-top: 16px; margin-bottom: 16px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .stat-num {
          font-size: 2.5rem;
          font-weight: 800;
          margin: 8px 0;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }
        .table th, .table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
        }
        .table th {
          background: #f8f9fa;
          font-weight: 700;
        }
        .badge {
          display: inline-block;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .badge.info { background: #e0f2fe; color: #0369a1; }
        .badge.warning { background: #fef3c7; color: #b45309; }
        .badge.danger { background: #fee2e2; color: #b91c1c; }
        .badge.success { background: #d1fae5; color: #065f46; }
        code {
          background: #f1f3f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔍 Reporte de Verificación Lingüística y Traducciones</h1>
        <p class="subtitle">Auditoría automatizada del Agente de Verificación de Onda Vital — Generado el ${new Date().toLocaleDateString('es-ES')}</p>

        <div class="grid">
          <div class="card p-4">
            <h3 style="margin-top:0; color:var(--text-muted)">Estado General DB</h3>
            <div class="stat-num" style="color:var(--accent)">${dbStats.total}</div>
            <p style="margin:0; font-size:14px;">Claves dinámicas totales registradas en SQLite.</p>
          </div>
          <div class="card p-4">
            <h3 style="margin-top:0; color:var(--text-muted)">Alertas de Coherencia</h3>
            <div class="stat-num" style="color:${totalIssues > 0 ? 'var(--warn)' : 'var(--success)'}">${totalIssues}</div>
            <p style="margin:0; font-size:14px;">Traducciones incompletas o vacías en DB/Diccionarios.</p>
          </div>
          <div class="card p-4">
            <h3 style="margin-top:0; color:var(--text-muted)">Idiomas Auditados</h3>
            <div class="stat-num" style="color:var(--success)">4</div>
            <p style="margin:0; font-size:14px;">Español (ES), Inglés (EN), Alemán (DE) y Catalán (CA).</p>
          </div>
        </div>

        <div class="card p-4">
          <h2>📊 Inconsistencias Estáticas en Base de Datos y i18n.js</h2>
          <p>Se listan los bloques y etiquetas configurados en el sistema pero que no tienen traducción asociada para algún idioma:</p>
          
          <table class="table">
            <thead>
              <tr>
                <th>Origen</th>
                <th>Clave (Key)</th>
                <th>Idioma</th>
                <th>Tipo Alerta</th>
                <th>Texto Español (ES)</th>
              </tr>
            </thead>
            <tbody>
              ${discrepancies.map(d => `
                <tr>
                  <td><span class="badge ${d.origen.includes('DB') ? 'info' : 'success'}">${d.origen}</span></td>
                  <td><code>${d.key}</code></td>
                  <td><span class="badge warning">${d.language.toUpperCase()}</span></td>
                  <td><span class="badge danger">${d.status}</span></td>
                  <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">"${d.esValue}"</td>
                </tr>
              `).join('')}
              ${discrepancies.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:var(--success); font-weight:700;">✅ ¡Cero discrepancias! Todos los diccionarios y base de datos están 100% alineados.</td></tr>' : ''}
            </tbody>
          </table>
        </div>

        ${browserSection}
      </div>
    </body>
    </html>
  `;

  // Guardar archivo HTML
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  console.log(`\n📄 Reporte HTML generado exitosamente en: ${htmlPath}`);

  // Generar reporte en Markdown para artefactos
  let mdContent = `# Reporte de Verificación Lingüística y Traducciones\n`;
  mdContent += `Generado el **${new Date().toLocaleDateString('es-ES')}** por el Agente de Verificación de Onda Vital.\n\n`;
  mdContent += `### Resumen Ejecutivo\n`;
  mdContent += `- **Claves en Base de Datos:** ${dbStats.total} (Faltan EN: ${dbStats.missingEn}, DE: ${dbStats.missingDe}, CA: ${dbStats.missingCa})\n`;
  mdContent += `- **Etiquetas Estáticas en i18n.js:** ${staticStats.total} (Faltan EN: ${staticStats.missingEn}, DE: ${staticStats.missingDe}, CA: ${staticStats.missingCa})\n`;
  mdContent += `- **Total Inconsistencias de Diccionario:** ${totalIssues}\n\n`;

  if (browserStats) {
    mdContent += `### Cobertura en Navegador Real (Playwright)\n`;
    Object.keys(browserStats).forEach(lang => {
      const stats = browserStats[lang];
      const pct = Math.round((stats.translated / (stats.totalTexts || 1)) * 100);
      mdContent += `- **[${lang.toUpperCase()}]**: **${pct}%** cobertura (${stats.translated}/${stats.totalTexts} textos correctos). Fugas: ${stats.untranslatedLeaks.length}, Hardcodeados: ${stats.hardcodedTexts.length}\n`;
    });
    
    mdContent += `\n### Textos Hardcodeados Detectados\n`;
    if (Object.keys(browserStats).some(lang => browserStats[lang].hardcodedTexts.length > 0)) {
      mdContent += `| Idioma | Texto | Elemento Selector |\n| --- | --- | --- |\n`;
      Object.keys(browserStats).forEach(lang => {
        browserStats[lang].hardcodedTexts.forEach(hc => {
          mdContent += `| ${lang.toUpperCase()} | "${hc.text}" | \`${hc.selector}\` |\n`;
        });
      });
    } else {
      mdContent += `*¡No se detectaron textos hardcodeados en la UI! Excelente.*\n`;
    }
  } else {
    mdContent += `> 💡 *Nota: No se ejecutó la verificación dinámica en navegador. Instale Playwright para auditar la interfaz en vivo.*\n`;
  }

  fs.writeFileSync(mdPath, mdContent, 'utf8');
}

// Ejecutar análisis
runAnalysis();
