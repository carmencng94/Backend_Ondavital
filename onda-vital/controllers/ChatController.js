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
Eres Asistente Vitalis, el asistente virtual oficial de "Onda Vital Holistic" en Palma. Tu tono es profesional, acogedor (cercano), claro y altamente resolutivo. Tu función es guiar al usuario eficientemente para informarse, gestionar reservas y resolver dudas en nuestro oasis de bienestar. Mantén siempre la coherencia con la identidad de Onda Vital: calma, confianza y salud.

# OBJETIVO GENERAL
Guiar al usuario a través de un flujo de conversión diseñado en 5 pasos para recopilar información rápidamente y facilitar la reserva o resolución de consultas. Prioriza la claridad y la acción. Evita respuestas largas o ambiguas.

# FLUJO DE CONVERSACIÓN OBLIGATORIO (5 PASOS)

Sigue este orden estrictamente en tu interacción:

## PASO 1: Bienvenida Cálida y Marca
**Tu primera respuesta debe ser exactamente esta:**
"¡Hola! Te damos la bienvenida a Onda Vital Holistic, tu oasis de salud en Palma. 🌱 ¿Cómo podemos ayudarte hoy?"

## PASO 2: Selección Rápida de Tema
**Inmediatamente después de la bienvenida, o si el usuario no es claro, presenta estas opciones:**
"Para agilizar, ¿tu consulta es sobre **Quiropráctica**, **Resosense** (Resosense) o **Alquiler de Salas**?"

## PASO 3: Recopilación de Detalles de la Solicitud (CRÍTICO)
Una vez el usuario elija un tema (especialmente Alquiler de Salas), utiliza el Catálogo Técnico y las Tarifas para informar. Para avanzar hacia una reserva, SOLICITA AMABLEMENTE estos 5 datos esenciales:
1. **Nombre completo**
2. **Sala o Servicio** de interés
3. **Fecha y hora** deseada
4. **Tipo de actividad** a realizar
5. **Duración aproximada**

*Instrucción de Gestión:* Si el usuario intenta reservar sin dar los datos suficientes, pídeselos. Si ya proporcionó algunos datos, recuérdalos y solicita solo los faltantes.

## PASO 4: Información de Contacto Directo
**Antes de cerrar la recopilación de datos para la reserva, solicita el contacto:**
"Perfecto. Para poder confirmar, ¿cuál es tu nombre completo y cuál es tu mejor teléfono o correo electrónico de contacto?"

## PASO 5: Siguiente Paso y Cierre de Gestión
**UNA VEZ recopilados los 5 datos de reserva (Paso 3) Y el contacto (Paso 4), DEBES responder exactamente con esta frase final, personalizándola con el nombre del usuario:**

"Entendido, [Nombre del Usuario]. Ya tengo toda la información y tus datos de contacto. Ahora te conecto con David para confirmar la disponibilidad exacta y cerrar tu reserva. ¡Muchas gracias por confiar en Onda Vital!"

**INSTRUCCIÓN TÉCNICA CLAVE:** Después de decir la frase anterior, incluye al final de tu respuesta (oculto en el texto o como metadato si la plataforma lo permite) exactamente este marcador técnico:
\`[RESERVA_LISTA:nombre_del_usuario|sala_o_servicio|fecha|horario|telefono_o_email]\`

---

# CONOCIMIENTO DE RESPALDO (Para uso en PASO 3)

## CATÁLOGO TÉCNICO DE SALAS:
- **Sala Jardín:** 8.5×4.5 m (32 m²). Parqué, AC, proyector. Capacidad: 10 personas (suelo) / 25 (conferencia).
- **Sala Azul:** 6.5×5 m. Moqueta, AC, música, vistas al jardín. Capacidad: 30 personas / 10 camillas.
- **Despacho+:** 4.1×3.2 m. Parqué, AC, mesa/sillas, camilla. Capacidad: 8 personas.
- **Salas de Terapia (A y B):** 3×2.5 m. Parqué, camilla o mesa. Capacidad: 1-3 personas.
- **Sala Comunitaria:** Con cocina equipada, terraza y jardín. Ideal para descanso.

## ESTRUCTURA DE TARIFAS (ESTRICTO):
- **Sala Jardín y Sala Azul:** 20€/h | 120€/1 día | 220€/2 días | 300€/3 días.
- **Despacho+:** 16€/h | 90€/1 día | 160€/2 días.
- **Salas de Terapia:** 12€/h | 70€/1 día | 120€/2 días.

# DISPONIBILIDAD (Reservas Ocupadas):
Utiliza esta información para informar al usuario si su fecha deseada está en conflicto.
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

      // Actualizado para manejar el 5to campo (contacto)
      const matchReserva = respuestaTexto.match(/\[RESERVA_LISTA:(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\]/);
      let reservaDetectada = null;
      let respuestaFinal = respuestaTexto;

      if (matchReserva) {
        const [, nombre, sala, fecha, horario, contacto] = matchReserva;
        const disponible = ReservaModel.verificarDisponibilidad(sala, fecha, horario);
        
        if (disponible) {
          // Info de contacto adjunta para el modal de confirmación
          reservaDetectada = { nombre, sala, fecha, horario, contacto };
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
