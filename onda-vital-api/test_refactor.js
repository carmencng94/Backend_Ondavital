// test_refactor.js
// Script to test the improved regex and parsing logic of ChatController

const ChatController = require('./controllers/ChatController');
const ReservaModel = require('./models/ReservaModel');

console.log("=== INICIANDO PRUEBAS DE CHATCONTROLLER ===");

const runTests = () => {
  let passedCount = 0;
  let failedCount = 0;

  const assert = (name, condition, details) => {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${name}`);
      if (details) console.error(`       Detalles: ${details}`);
      failedCount++;
    }
  };

  // Test Case 1: Reserva válida con 6 campos y espacios
  console.log("\n--- Prueba 1: 6 campos con espacios y mayúsculas ---");
  const input1 = "[RESERVA_LISTA: Juan Carlos Pérez | Sala Jardín G1 | 22/05/2026 | 17:00 a 19:00 | juan.perez@example.com | 600111222]";
  const result1 = ChatController._procesarRespuestaIA(input1);
  assert("Detecta la reserva", result1.reservaDetectada !== null);
  if (result1.reservaDetectada) {
    assert("Nombre correcto", result1.reservaDetectada.nombre === "Juan Carlos Pérez");
    assert("Sala correcta", result1.reservaDetectada.sala === "Sala Jardín G1");
    assert("Fecha correcta", result1.reservaDetectada.fecha === "22/05/2026");
    assert("Horario correcto", result1.reservaDetectada.horario === "17:00 a 19:00");
    assert("Email correcto", result1.reservaDetectada.email === "juan.perez@example.com");
    assert("Teléfono correcto", result1.reservaDetectada.telefono === "600111222");
    assert("Contacto correcto", result1.reservaDetectada.contacto === "600111222");
  }

  // Test Case 2: Reserva válida con 5 campos y espacios (solo email)
  console.log("\n--- Prueba 2: 5 campos con espacios (solo email) ---");
  const input2 = "  [RESERVA_LISTA:  Ana Gómez  |  Terapia A  |  25/05/2026  |  10:00 a 11:00  |  ana@example.com  ]  ";
  const result2 = ChatController._procesarRespuestaIA(input2);
  assert("Detecta la reserva con 5 campos (email)", result2.reservaDetectada !== null);
  if (result2.reservaDetectada) {
    assert("Nombre recortado", result2.reservaDetectada.nombre === "Ana Gómez");
    assert("Sala recortada", result2.reservaDetectada.sala === "Terapia A");
    assert("Email detectado correctamente", result2.reservaDetectada.email === "ana@example.com");
    assert("Teléfono está vacío", result2.reservaDetectada.telefono === "");
    assert("Contacto es el email", result2.reservaDetectada.contacto === "ana@example.com");
  }

  // Test Case 3: Reserva válida con 5 campos (solo teléfono)
  console.log("\n--- Prueba 3: 5 campos (solo teléfono) ---");
  const input3 = "[reserva_lista: Pepa Flores | Despacho+ | 26/05/2026 | 09:00 a 10:00 | 699888777]";
  const result3 = ChatController._procesarRespuestaIA(input3);
  assert("Detecta reserva en minúsculas y solo teléfono", result3.reservaDetectada !== null);
  if (result3.reservaDetectada) {
    assert("Nombre correcto", result3.reservaDetectada.nombre === "Pepa Flores");
    assert("Sala correcta", result3.reservaDetectada.sala === "Despacho+");
    assert("Email está vacío", result3.reservaDetectada.email === "");
    assert("Teléfono detectado correctamente", result3.reservaDetectada.telefono === "699888777");
    assert("Contacto es el teléfono", result3.reservaDetectada.contacto === "699888777");
  }

  // Test Case 4: Validación de nombre (menos de 2 palabras)
  console.log("\n--- Prueba 4: Validación de nombre (menos de 2 palabras) ---");
  const input4 = "[RESERVA_LISTA: Pepito | Sala Jardín G1 | 22/05/2026 | 17:00 a 19:00 | pepito@example.com]";
  const result4 = ChatController._procesarRespuestaIA(input4);
  assert("Rechaza la reserva por falta de apellidos", result4.reservaDetectada === null);
  assert("Muestra mensaje de advertencia correcto", result4.respuestaFinal.includes("nombre y apellidos completos"));

  // Test Case 5: Detección de consulta de estado de reserva
  console.log("\n--- Prueba 5: Consulta de reserva ---");
  // Guardamos una de prueba primero
  const reservaDePrueba = ReservaModel.guardar({
    nombre: "Juan Pérez",
    sala: "Sala Jardín G1",
    fecha: "20/05/2026",
    horario: "18:00 a 20:00",
    contacto: "juan@example.com"
  });
  
  const idCreado = reservaDePrueba.id;
  const input5 = `[CONSULTAR_RESERVA: ${idCreado}]`;
  const result5 = ChatController._procesarRespuestaIA(input5);
  assert("Procesa la consulta", result5.respuestaFinal.includes("He encontrado tu reserva"));
  assert("Contiene nombre del usuario", result5.respuestaFinal.includes("Juan Pérez"));
  assert("Contiene la sala", result5.respuestaFinal.includes("Sala Jardín G1"));
  
  // Test Case 6: Consulta de reserva inexistente
  console.log("\n--- Prueba 6: Consulta de reserva inexistente ---");
  const input6 = "[consultar_reserva: OV-INEXISTENTE]";
  const result6 = ChatController._procesarRespuestaIA(input6);
  assert("Informa amablemente del error", result6.respuestaFinal.includes("no he podido encontrar ninguna reserva"));

  console.log(`\n=== RESULTADOS: ${passedCount} PASADAS, ${failedCount} FALLIDAS ===`);
};

runTests();
