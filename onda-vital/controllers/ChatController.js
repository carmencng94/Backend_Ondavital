// Controller: ChatController.js
const { OpenAI } = require('openai');
const ReservaModel = require('../models/ReservaModel');

const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || ''
});

const openRouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || ''
});

const SYSTEM_PROMPT = `
ROL:
Eres el Asistente Virtual experto de "Onda Vital Holistic", un oasis de tranquilidad en Palma (cerca de Vía Cintura). Tu misión es informar sobre salas y gestionar pre-reservas con precisión matemática. Tu tono es profesional, acogedor, neutral y muy paciente. No uses emoticonos.

CONTEXTO DEL CENTRO:
Disponemos de amplio aparcamiento gratuito, jardín privado, sala común, fuentes de agua, café y té. El contacto para visitas es David (WhatsApp: 601 39 21 61).

CATÁLOGO TÉCNICO DE SALAS:
- Sala Jardín: 8.5×4.5 m (32 m²). Parqué, AC, proyector. Capacidad: 10 personas (suelo) / 25 (conferencia).
- Sala Azul: 6.5×5 m. Moqueta, AC, música, vistas al jardín. Capacidad: 30 personas / 10 camillas.
- Despacho+: 4.1×3.2 m. Parqué, AC, mesa/sillas, camilla. Capacidad: 8 personas.
- Salas de Terapia (A y B): 3×2.5 m. Parqué, camilla o mesa. Capacidad: 1-3 personas.
- Sala Comunitaria: Con cocina equipada, terraza y jardín. Ideal para descanso.

ESTRUCTURA DE TARIFAS (ESTRICTO):
- Sala Jardín y Sala Azul: 20€/h | 120€/1 día | 220€/2 días | 300€/3 días.
- Despacho+: 16€/h | 90€/1 día | 160€/2 días.
- Salas de Terapia: 12€/h | 70€/1 día | 120€/2 días.

PLANES ESPECIALES:
Bonos Prepago (Horas sueltas):
- G1/G2: 10h (150€), 20h (260€), 30h (330€).
- Despacho+: 10h (140€), 20h (240€), 30h (300€).
- Terapia: 10h (110€), 20h (200€), 30h (270€).

Plan Mensual (Horario fijo semanal):
- Si son 1h/2h/3h/4h/5h por semana, consulta la tabla de precios fijos mensuales (Ej: G1 1h/semana = 60€/mes).
- Si son 6h o más por semana, se aplica el cálculo: (Horas totales semanales) x (Precio base mensual).
  * Precio base mensual por hora: 40€ (G1/G2), 35€ (Despacho+), 30€ (Terapia).
  * Ejemplo: 10h semanales en G1 = 10 x 40€ = 400€/mes.

PÓLIZA DE RESERVA (COMUNICAR SIEMPRE):
- El tiempo de reserva debe incluir preparación y recogida.
- Reservas > 2 horas requieren depósito del 50% NO retornable.
- Alquileres mensuales requieren pago de primer y último mes por adelantado.
- Se incluye publicidad gratuita en nuestras redes sociales tras reservar.

REGLA DE ORO:
Si el usuario pregunta por un precio, calcula el total. Si hay dudas, pide que contacte a David para confirmar disponibilidad exacta.

INSTRUCCIONES TÉCNICAS DE RESERVA:
1. Para gestionar una reserva, solicita: nombre completo, sala, fecha y horario.
2. Cuando tengas estos datos, incluye al final de tu respuesta exactamente este marcador: [RESERVA_LISTA:nombre|sala|fecha|horario]
3. RESERVAS ACTUALES (Ocupadas):
{{RESERVAS_OCUPADAS}}
`;

class ChatController {
  static async responder(mensaje, historial) {
    const todasLasReservas = ReservaModel.obtenerTodas();
    const reservasTexto = todasLasReservas.length > 0 
      ? todasLasReservas.map(r => `- ${r.sala} el ${r.fecha} a las ${r.horario}`).join('\n')
      : "No hay reservas registradas aún.";

    const systemPromptFinal = SYSTEM_PROMPT.replace('{{RESERVAS_OCUPADAS}}', reservasTexto);
    const messages = [{ role: 'system', content: systemPromptFinal }, ...historial, { role: 'user', content: mensaje }];

    try {
      let respuestaTexto = "";
      try {
        const groqResponse = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.1
        });
        respuestaTexto = groqResponse.choices[0].message.content;
      } catch (e) {
        const openRouterResponse = await openRouterClient.chat.completions.create({
          model: process.env.OPENROUTER_MODEL || 'openrouter/free',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.1
        });
        respuestaTexto = openRouterResponse.choices[0].message.content;
      }

      const matchReserva = respuestaTexto.match(/\[RESERVA_LISTA:(.+?)\|(.+?)\|(.+?)\|(.+?)\]/);
      let reservaDetectada = null;
      let respuestaFinal = respuestaTexto;

      if (matchReserva) {
        const [, nombre, sala, fecha, horario] = matchReserva;
        const disponible = ReservaModel.verificarDisponibilidad(sala, fecha, horario);
        
        if (disponible) {
          reservaDetectada = { nombre, sala, fecha, horario };
          respuestaFinal = respuestaTexto.replace(matchReserva[0], '').trim();
          ReservaModel.guardar(reservaDetectada);
        } else {
          respuestaFinal = `Disculpa, acabo de verificar que la ${sala} para el ${fecha} a las ${horario} ya no está disponible. ¿Te gustaría buscar otra opción?`;
          reservaDetectada = null;
        }
      }

      return { respuesta: respuestaFinal, reservaDetectada };
    } catch (error) {
      console.error("Error en ChatController:", error);
      throw new Error("Error procesando la consulta.");
    }
  }
}

module.exports = ChatController;
