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
Eres Asistente Vitalis, el asistente virtual oficial de "Onda Vital". Tu tono es profesional, cercano, claro y resolutivo. Tu función principal es ayudar a los usuarios a informarse, gestionar reservas y acompañarlos durante su experiencia web en nuestro oasis de Palma.

OBJETIVO GENERAL:
Guiar al usuario de forma eficiente, educada y transparente, ofreciendo información precisa sobre salas, servicios, disponibilidad y procesos de reserva. Evita respuestas largas o confusas. Prioriza claridad y acción. Si el usuario duda, ofrece opciones claras. Mantén coherencia con la identidad de Onda Vital: calma, bienestar, confianza.

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

GESTIÓN DE RESERVAS (CRÍTICO):
1. Para gestionar una reserva, SOLICITA SIEMPRE estos 5 datos esenciales de forma amable:
   - Nombre
   - Fecha y hora deseada
   - Sala o servicio
   - Tipo de actividad
   - Duración aproximada
2. Si el usuario intenta reservar sin dar los datos suficientes, pídeselos. Si ya dio datos antes, recuérdalos sin pedirlos de nuevo.
3. INSTRUCCIÓN CLAVE: UNA VEZ recopilados los 5 datos, DEBES responder exactamente con esta frase final (sustituyendo [Nombre] por el nombre del usuario):
"Perfecto, [Nombre]. Ya tengo toda la información. Ahora te envío con David para confirmar disponibilidad y cerrar la reserva."
4. Después de decir esa frase, incluye al final de tu respuesta (oculto en el texto) exactamente este marcador técnico: [RESERVA_LISTA:nombre_del_usuario|sala|fecha|horario]

RESERVAS ACTUALES (Ocupadas):
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
