// scratch/test_parser.js
const { extractDates } = require('../utils/dateParser');

// Usar una fecha de referencia fija: Viernes 29 de Mayo de 2026
const refDate = new Date(2026, 4, 29); // Mes 4 es Mayo en JS Date

const tests = [
  {
    input: "Quiero reservar para hoy",
    expected: ["2026-05-29"]
  },
  {
    input: "heute, übermorgen und morgen",
    expected: ["2026-05-29", "2026-05-30", "2026-05-31"]
  },
  {
    input: "Quiero ir el lunes que viene",
    expected: ["2026-06-01"] // Lunes es 1 de Junio
  },
  {
    input: "Me viene bien el 12/06/2026 o el 2026-06-15",
    expected: ["2026-06-12", "2026-06-15"]
  },
  {
    input: "Reservar el 12 de junio y el june 13",
    expected: ["2026-06-12", "2026-06-13"]
  },
  {
    input: "avui o demà passat",
    expected: ["2026-05-29", "2026-05-31"]
  }
];

let failed = 0;

console.log("=== INICIANDO VALIDACIÓN DE DATE PARSER ===");
console.log(`Fecha de referencia: ${refDate.toDateString()}\n`);

tests.forEach((t, i) => {
  const result = extractDates(t.input, refDate);
  const match = JSON.stringify(result) === JSON.stringify(t.expected);
  
  if (match) {
    console.log(`✅ Test ${i + 1} PASÓ: "${t.input}" -> ${JSON.stringify(result)}`);
  } else {
    console.error(`❌ Test ${i + 1} FALLÓ!`);
    console.error(`  Input:    "${t.input}"`);
    console.error(`  Esperado: ${JSON.stringify(t.expected)}`);
    console.error(`  Obtenido: ${JSON.stringify(result)}`);
    failed++;
  }
});

console.log(`\nPruebas finalizadas: ${tests.length - failed}/${tests.length} correctas.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("✅ ¡Todo correcto!");
  process.exit(0);
}
