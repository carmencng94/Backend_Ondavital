require('dotenv').config();
const googleCalendarService = require('./services/GoogleCalendarService');

async function test() {
  const reserva = {
    nombre: 'Test User',
    sala: 'G1',
    fecha: '2026-03-27',
    horario: '10:00, 11:00'
  };
  
  try {
    const res = await googleCalendarService.crearEvento(reserva);
    console.log("Success:", !!res);
  } catch (err) {
    if (err.response) {
      console.error("Google Error:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err);
    }
  }
}
test();
