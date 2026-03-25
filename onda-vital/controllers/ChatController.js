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

const SYSTEM_PROMPT = `# ROL E IDENTIDAD
Eres Asistente Vitalis, el asistente virtual oficial de "Onda Vital Holistic" en Palma. Tu tono es profesional, acogedor (cercano), claro y altamente resolutivo.

# CONTEXTO TEMPORAL
Fecha actual: {{FECHA_ACTUAL}}

# OBJETIVOS
1. Resolver dudas sobre Quiropráctica, Resosense y Alquiler de Salas.
2. Gestionar pre-reservas siguiendo el flujo de 5 pasos.
3. Consultar o modificar reservas existentes mediante un CÓDIGO DE RESERVA.

# REGLAS DE FECHAS (CRÍTICO)
- Siempre interpreta términos como "hoy", "mañana", "el lunes" basándote en la fecha actual ({{FECHA_ACTUAL}}).
- En el marcador técnico [RESERVA_LISTA:...], la fecha DEBE estar obligatoriamente en formato DD/MM/YYYY.
- Si el usuario dice "mañana" y hoy es 24/03/2026, la fecha es 25/03/2026.

# FLUJO DE CONVERSACIÓN (5 PASOS)
1. **Bienvenida**: "¡Hola! Te damos la bienvenida a Onda Vital Holistic... ¿Cómo podemos ayudarte hoy?"
2. **Selección de Tema**: ¿Quiropráctica, Resosense o Alquiler de Salas?
3. **Detalles (Validación)**:
   - **Nombre completo**: Asegúrate de que parezca un nombre real (mínimo dos palabras).
   - **Sala/Servicio**, **Fecha/Hora** (valida disponibilidad), **Actividad** y **Duración**.
4. **Contacto**: Teléfono o correo.
5. **Cierre**: "Entendido [Nombre]. Ya tengo todo... te conecto con David. Tu código provisional de gestión es: **{{ID_RESERVA}}**."
   - Incluye el marcador: \`[RESERVA_LISTA:nombre|sala|fecha|horario|contacto]\`

# CONSULTAS Y MODIFICACIONES
Si el usuario pregunta "¿cuándo es mi reserva?" o quiere modificarla:
- Solicita el **Código de Reserva**.
- Si lo proporciona, usa el marcador: \`[CONSULTAR_RESERVA:codigo]\`.
- Si el código no existe o no se proporciona, no des información privada. Informa que las reservas "confirmadas" se gestionan directamente con David, pero tú puedes ver las "pendientes" si tienen el código.

# DISPONIBILIDAD (Reservas Ocupadas):
{{RESERVAS_OCUPADAS}}
`;

class ChatController {
  static async responder(mensaje, historial) {
    const todasLasReservas = ReservaModel.obtenerTodas();
    const reservasTexto = todasLasReservas.length > 0 
      ? todasLasReservas.map(r => `- ${r.sala}: ${r.fecha} a las ${r.horario} (${r.estado})`).join('\n')
      : "No hay reservas registradas aún.";

    // Obtener fecha actual en formato legible para la IA
    const ahora = new Date();
    const fechaActualStr = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let systemPromptFinal = SYSTEM_PROMPT
      .replace(/{{FECHA_ACTUAL}}/g, fechaActualStr)
      .replace('{{RESERVAS_OCUPADAS}}', reservasTexto)
      .replace('{{ID_RESERVA}}', '[PENDIENTE_DE_GENERAR]');

    const messages = [{ role: 'system', content: systemPromptFinal }, ...historial, { role: 'user', content: mensaje }];

    try {
      let respuestaTexto = "";
      const streamOptions = {
        max_tokens: 1000,
        temperature: 0.1
      };

      try {
        const groqResponse = await groqClient.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: messages,
          ...streamOptions
        });
        respuestaTexto = groqResponse.choices[0].message.content;
      } catch (e) {
        const openRouterResponse = await openRouterClient.chat.completions.create({
          model: process.env.OPENROUTER_MODEL || 'openrouter/free',
          messages: messages,
          ...streamOptions
        });
        respuestaTexto = openRouterResponse.choices[0].message.content;
      }

      let reservaDetectada = null;
      let respuestaFinal = respuestaTexto;

      // 1. Detección de Consulta de Reserva
      const matchConsulta = respuestaTexto.match(/\[CONSULTAR_RESERVA:(.+?)\]/);
      if (matchConsulta) {
        const codigo = matchConsulta[1].trim();
        const reserva = ReservaModel.obtenerPorId(codigo);
        if (reserva) {
          respuestaFinal = `He encontrado tu reserva, ${reserva.nombre}. Tienes reservada la **${reserva.sala}** para el día **${reserva.fecha}** a las **${reserva.horario}**. El estado actual es: **${reserva.estado}**.`;
        } else {
          respuestaFinal = `Lo siento, no he podido encontrar ninguna reserva con el código **${codigo}**. Por favor, verifica el código o contacta directamente con David.`;
        }
        return { respuesta: respuestaFinal, reservaDetectada: null };
      }

      // 2. Detección de Nueva Reserva
      const matchReserva = respuestaTexto.match(/\[RESERVA_LISTA:(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\]/);
      if (matchReserva) {
        const [, nombre, sala, fecha, horario, contacto] = matchReserva;
        
        // Validar nombre (mínimo 2 palabras)
        if (nombre.trim().split(/\s+/).length < 2) {
            return { 
                respuesta: "Por favor, indícame tu nombre y apellidos completos para poder procesar la reserva correctamente.",
                reservaDetectada: null 
            };
        }

        const disponible = ReservaModel.verificarDisponibilidad(sala, fecha, horario);
        
        if (disponible) {
          // Generamos el ID aquí antes de guardar para poder mostrarlo
          const idReserva = Math.random().toString(36).substring(2, 8).toUpperCase();
          reservaDetectada = { id: idReserva, nombre, sala, fecha, horario, contacto };
          
          ReservaModel.guardar(reservaDetectada);
          
          // Reemplazamos el marcador y el placeholder del ID en la respuesta
          respuestaFinal = respuestaTexto
            .replace(matchReserva[0], '')
            .replace('[PENDIENTE_DE_GENERAR]', idReserva)
            .trim();
        } else {
          respuestaFinal = `Disculpa, acabo de verificar que la ${sala} para el ${fecha} a las ${horario} ya no está disponible. ¿Te gustaría buscar otra fecha o sala?`;
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
