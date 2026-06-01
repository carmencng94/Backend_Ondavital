require('dotenv').config();
const googleCalendarService = require('../services/GoogleCalendarService');

async function testToday() {
  // Fecha de hoy: 29 de Mayo de 2026
  const reserva = {
    nombre: 'Sincronización Hoy (Test)',
    sala: 'Sala Jardín G1',
    fecha: '2026-05-29',
    horario: '18:00, 19:00',
    contacto_real: '601392161'
  };
  
  console.log("Insertando evento de prueba en Google Calendar para HOY (2026-05-29)...");
  
  try {
    const res = await googleCalendarService.crearEvento(reserva);
    if (res) {
      console.log("\n✅ ¡ÉXITO! Evento insertado correctamente.");
      console.log(`- Enlace al Evento: ${res.htmlLink}`);
      console.log(`- ID del Evento:    ${res.id}`);
    } else {
      console.log("❌ Falló el servicio de Google Calendar (revisa logs).");
    }
  } catch (err) {
    console.error("Error crítico:", err.message);
  }
}

testToday();
