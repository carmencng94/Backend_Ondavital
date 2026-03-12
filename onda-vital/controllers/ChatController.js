// Controller: ChatController.js
// Propósito: Gestionar la interacción con el chatbot de Anthropic (Claude).
// Contiene el prompt del sistema y la lógica de parseo de intenciones.

const { OpenAI } = require('openai');
const ReservaModel = require('../models/ReservaModel');

// Configuración de clientes OpenAI-compatibles para Groq y OpenRouter
const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || ''
});

const openRouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || ''
});

const SYSTEM_PROMPT = `
Eres el Asistente Virtual de "Onda Vital Holistic", un centro en Palma de Mallorca 
dedicado al bienestar, terapias y talleres. Tu objetivo es ayudar a los usuarios 
a conocer nuestras instalaciones y facilitar el proceso de reserva de salas.
Tono: amable, profesional, acogedor y muy claro.

UBICACIÓN: c/ Martí Boneo, 31 bajos, 07013 Palma de Mallorca.
FILOSOFÍA: "Nuestro enfoque eres tú". Vuelve a empezar cada día con ilusión (Network Spinal Analysis y Resosense).

SALAS DISPONIBLES:
- Sala Jardín, Sala Azul, Despacho+, Sala Terapia A, Sala Terapia B, Sala Comunitaria.
(El usuario ya ve sus detalles en la web, no los repitas a menos que te pregunten específicamente).

REGLAS:
1. Sé extremadamente conciso. Si el usuario pide reservar, ve directo al grano.
2. Si preguntan por disponibilidad, di que puedes ayudar a pre-reservar 
   y que la confirmación final la da David.
3. Para reservar, solicita siempre: nombre completo, sala de interés, fecha y horario.
4. Si el usuario proporciona los datos, genera el marcador inmediatamente.
5. Proporcionar el WhatsApp de David solo si es necesario o al confirmar: 601 39 21 61.
6. No repitas descripciones de salas que ya están en la UI de la web.
7. FLUJO DIRECTO: Si el usuario proporciona Nombre, Sala, Fecha y Horario de golpe, confirma inmediatamente con el marcador.
8. Cuando tengas nombre, sala, fecha y horario completos, incluye al final de tu respuesta 
   exactamente este marcador: [RESERVA_LISTA:nombre|sala|fecha|horario]

RESERVAS ACTUALES (Ocupadas):
{{RESERVAS_OCUPADAS}}
`;

class ChatController {
  /**
   * Recibe el mensaje actual y el historial, llama a Anthropic y procesa posibles reservas.
   */
  static async responder(mensaje, historial) {
    if (!mensaje) {
      throw new Error("El mensaje es requerido.");
    }
    if (!Array.isArray(historial)) {
      throw new Error("El historial debe ser un arreglo.");
    }

    // Construimos el payload de mensajes para Anthropic
    // El historial del frontend debe tener formato { role: 'user'|'assistant', content: string }
    // Obtener reservas actuales para informar a la IA sobre la disponibilidad
    const todasLasReservas = ReservaModel.obtenerTodas();
    const reservasTexto = todasLasReservas.length > 0 
      ? todasLasReservas.map(r => `- ${r.sala} el ${r.fecha} a las ${r.horario}`).join('\n')
      : "No hay reservas registradas aún.";

    const systemPromptFinal = SYSTEM_PROMPT.replace('{{RESERVAS_OCUPADAS}}', reservasTexto);

    const messages = [{ role: 'system', content: systemPromptFinal }, ...historial, { role: 'user', content: mensaje }];

    try {
      let respuestaTexto = "";
      
      // Intentamos con Groq primero (usando llama-3.3-70b-versatile o similar, muy rápido)
      try {
        if (!process.env.GROQ_API_KEY) throw new Error("Falta GROQ_API_KEY");
        const groqResponse = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.3
        });
        respuestaTexto = groqResponse.choices[0].message.content;
      } catch (groqError) {
        console.warn("Fallo Groq, intentando con OpenRouter...", groqError.message);
        
        // Fallback a OpenRouter
        const openRouterResponse = await openRouterClient.chat.completions.create({
          model: process.env.OPENROUTER_MODEL || 'openrouter/free',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.3
        });
        respuestaTexto = openRouterResponse.choices[0].message.content;
      }
      
      // Parsear la respuesta en busca del marcador de reserva
      const matchReserva = respuestaTexto.match(/\[RESERVA_LISTA:(.+?)\|(.+?)\|(.+?)\|(.+?)\]/);
      let reservaDetectada = null;
      
      let respuestaFinal = respuestaTexto;

      if (matchReserva) {
        // Extraer los datos y limpiar la respuesta para que el usuario no vea el tag
        const [, nombre, sala, fecha, horario] = matchReserva;
        
        // Verificación de seguridad extra en el controlador (Disponibilidad real)
        const disponible = ReservaModel.verificarDisponibilidad(sala, fecha, horario);
        
        if (disponible) {
          reservaDetectada = { nombre, sala, fecha, horario };
          // Limpiamos el texto que se le muestra al usuario
          respuestaFinal = respuestaTexto.replace(matchReserva[0], '').trim();
          // Registrar la pre-reserva automáticamente
          ReservaModel.guardar(reservaDetectada);
        } else {
          // Si por casualidad la IA lo permitió pero está ocupado, sobreescribimos
          respuestaFinal = `Lo siento, acabo de comprobar que la ${sala} para el ${fecha} a las ${horario} ya ha sido reservada hace instantes. ¿Te gustaría elegir otro horario o sala?`;
          reservaDetectada = null;
        }
      }

      return {
        respuesta: respuestaFinal,
        reservaDetectada
      };

    } catch (error) {
      console.error("Error en ChatController:", error);
      throw new Error("No pudimos conectar con el Asistente. Inténtalo de nuevo.");
    }
  }
}

module.exports = ChatController;
