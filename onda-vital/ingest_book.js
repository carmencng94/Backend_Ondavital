const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const Database = require('better-sqlite3');

const pdfPath = "C:\\Users\\Usuario\\Desktop\\INTERIOR_Resosense_CAST_V1  7 Mayo.pdf";
const rawDbPath = process.env.DB_PATH || './memory.db';
const dbPath = path.isAbsolute(rawDbPath)
  ? rawDbPath
  : path.resolve(__dirname, rawDbPath);

if (!fs.existsSync(pdfPath)) {
    console.error(`El archivo PDF no existe en la ruta: ${pdfPath}`);
    process.exit(1);
}

// 1. Inicializar la base de datos y la tabla
console.log("Inicializando base de datos...");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS book_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_num INTEGER,
    content TEXT NOT NULL
  );
  
  CREATE INDEX IF NOT EXISTS idx_book_chunks_page ON book_chunks(page_num);
`);

// Limpiar chunks previos para evitar duplicados
db.exec("DELETE FROM book_chunks");
console.log("Base de datos lista (registros anteriores eliminados).");

// 2. Cargar y parsear el PDF
console.log("Cargando el archivo PDF en memoria...");
const dataBuffer = fs.readFileSync(pdfPath);
const uint8Data = new Uint8Array(dataBuffer);

console.log("Parseando PDF y extrayendo texto...");
const parser = new PDFParse(uint8Data);

parser.getText().then(function(result) {
    console.log(`Lectura del PDF completada. Páginas detectadas: ${result.total}`);
    
    const pages = result.pages;
    // Ordenar páginas para procesar en orden secuencial
    pages.sort((a, b) => a.num - b.num);

    // Preparar el statement de inserción
    const insertStmt = db.prepare("INSERT INTO book_chunks (page_num, content) VALUES (?, ?)");

    let totalChunks = 0;
    const allChunksToInsert = [];

    for (const page of pages) {
        // Normalizar texto
        const normalized = page.text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
        if (!normalized) continue;

        // Chunking por párrafos combinados
        const paragraphs = normalized.split('\n\n');
        let currentChunk = '';

        for (let para of paragraphs) {
            para = para.trim();
            if (!para) continue;

            // Si agregar el párrafo supera los 1000 caracteres, guardar el chunk actual y empezar uno nuevo
            if ((currentChunk + '\n\n' + para).length > 1000) {
                if (currentChunk) {
                    allChunksToInsert.push({
                        page: page.num,
                        content: currentChunk.trim()
                    });
                    totalChunks++;
                }
                currentChunk = para;
            } else {
                currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
            }
        }

        // Guardar el último chunk de la página
        if (currentChunk) {
            allChunksToInsert.push({
                page: page.num,
                content: currentChunk.trim()
            });
            totalChunks++;
        }
    }

    // Ejecutar todas las inserciones en una sola transacción para máxima velocidad
    console.log(`Guardando ${totalChunks} chunks de texto en la base de datos...`);
    const insertTransaction = db.transaction((allChunks) => {
        for (const chunk of allChunks) {
            insertStmt.run(chunk.page, chunk.content);
        }
    });

    insertTransaction(allChunksToInsert);

    console.log("¡Ingesta completada con éxito!");
    
    // Mostrar estadísticas
    const count = db.prepare("SELECT COUNT(*) as count FROM book_chunks").get().count;
    console.log(`Total de registros guardados en 'book_chunks': ${count}`);
    
    // Mostrar un ejemplo de chunk
    const sample = db.prepare("SELECT * FROM book_chunks LIMIT 1").get();
    if (sample) {
        console.log(`\nEjemplo de chunk (Página ${sample.page_num}):`);
        console.log("-----------------------------------------");
        console.log(sample.content.substring(0, 300) + "...");
        console.log("-----------------------------------------");
    }

    db.close();
    process.exit(0);
}).catch(err => {
    console.error("Error al procesar y guardar el PDF:", err);
    process.exit(1);
});
