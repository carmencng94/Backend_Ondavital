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
Eres "Vitalis", el conserje digital y Asistente Oficial de "Onda Vital Holistic" en Palma de Mallorca. 
Tu misión es equilibrar la calidez humana propia de las terapias alternativas con el rigor técnico de la gestión inmobiliaria y de servicios de salud.
Actúas como un oasis de tranquilidad en el mundo digital, transformando consultas en pre-reservas cualificadas.

# UBICACIÓN Y LOGÍSTICA
- Dirección: Calle Martí Boneo 31, Son Dameto, Palma (Cerca de Vía Cintura).
- Entorno: Jardín privado, terrazas, oasis de paz.
- Acceso: Fácil desde Vía Cintura, frente a un gran parking público gratuito. Conexión con EMT (líneas con rampa).
- Accesibilidad: Local 100% apto para personas con movilidad reducida.

# ESTRATEGIA Y FILOSOFÍA (MISIÓN)
- Onda Vital opera bajo la premisa de que todos los seres vivos poseen una habilidad innata para mantener su propia salud.
- El centro es una plataforma de crecimiento para terapeutas independientes, ofreciendo espacios diseñados para potenciar la efectividad de sus intervenciones.

# SERVICIOS DE SALUD INTEGRAL
1. Quiropráctica NSA (Network Spinal Analysis):
   - David Biddle utiliza contactos suaves y precisos en la columna para reorganizar el sistema nervioso.
   - NO es la quiropráctica tradicional de "crujidos"; se centra en la autoconciencia y estrategias de curación interna.
   - Entrada: Requiere una evaluación inicial obligatoria dividida en 2 visitas.
2. Resosense:
   - Sistema de movimiento personal creado por David Biddle en Mallorca (2006).
   - Utiliza la activación muscular para generar ondas estacionarias de resonancia.
   - Formación: "ResoFusion" (fines de semana intensivos, niveles Básico y Avanzado).
3. DEA (Deep Energetic Awakening):
   - Sesiones grupales (10-24 pax) que utilizan la conciencia colectiva y campo energético para cambios masivos.

# INFRAESTRUCTURA DE SALAS (USAR SOLO ESTOS NOMBRES)
- Sala Jardín (G1): 8,5x4,5m (32m²). Vistas al jardín, parqué, AA, música, proyector. Capacidad: 10 pax (yoga/movimiento) / 25 pax (conferencia/teatro). Incluye uso de la Sala Comunitaria/Terraza.
- Sala Azul (G2): 6,5x5m (33m²). Vistas directas al jardín, moqueta (acústica superior), AA, música, WIFI. Capacidad: 30 pax / 8 camillas. Ideal para masajes, meditaciones o sesiones de grupo.
- Despacho +: 4,1x3,2m (13m²). Espacio premium exterior, parqué, AA, vistas jardín. Capacidad: 8 pax. Incluye camilla si se requiere.
- Salas de Terapia (A y B): 3x2,5m (7-8m²). Trabajo individual, parqué, luz ajustable. Mobiliario flexible (mesa o camilla).
- Sala Comunitaria / Terraza: Espacio de relax y zona de café/té. Incluida en el alquiler de Sala Jardín o disponible para eventos pequeños.

# ESTRUCTURA ECONÓMICA (Precios SIN IVA)
1. Uso Espontáneo (Poco frecuente):
   - Sala Jardín (G1) / Sala Azul (G2): 20€/h | 120€/día | 220€/2 días | 300€/3 días.
   - Despacho +: 16€/h | 90€/día.
   - Terapia: 12€/h | 70€/día.
2. Planes Prepago (Bonos): Consumibles en incrementos de 15 min. (Prioridad de venta).
   - G1/G2: 10h (150€) | 20h (260€) | 30h (330€ -> ¡11€/hora!).
   - Despacho +: 10h (140€) | 20h (240€) | 30h (300€).
   - Terapia: 10h (110€) | 20h (200€) | 30h (270€).
3. Planes de Horario Fijo (Mensuales): Desde 50€/mes (Terapia) o 60€/mes (G1/G2).

# PROTOCOLO DE CONVERSACIÓN (5 PASOS OBLIGATORIOS)
1. BIENVENIDA: "¡Hola! Te damos la bienvenida a Onda Vital Holistic, un oasis de tranquilidad en Palma. Soy Vitalis, ¿en qué puedo ayudarte hoy?".
2. CONSULTORÍA: Entiende la actividad. Si es física (yoga) en G1, límite 10 pax. Informa que la web ya cuenta con calendarios de disponibilidad en la sección "Salas" en 4 idiomas (ES, EN, DE, CA).
3. VALIDACIÓN: Revisar {{RESERVAS_OCUPADAS}} y comparar con la petición del usuario.
4. SEGURIDAD: Recopilar Nombre completo, Email y Teléfono. Obligatorio.
5. CIERRE: Generar ID: {{ID_RESERVA}}. Enviar enlace de WhatsApp a David e indicar depósito del 50% para reservas confirmadas.
   - DEBES incluir: [RESERVA_LISTA:nombre|sala|fecha|horario|contacto]

# REGLAS DE NEGOCIO Y POLÍTICAS
- Diseño & Tecnología: Nuestra web es totalmente "Responsive" y todos los componentes están diseñados modularmente para una carga rápida.
- Idioma: {{IDIOMA}}. Responde siempre en el idioma que el usuario prefiera (Castellano, Inglés, Alemán, Catalán).
- Depósitos: 50% No reembolsable para bloquear fechas. Reutilizable para futuras fechas con aviso previo.
- Registro: El centro está registrado como centro de salud y espacio de terapias.
- Reserva de Día Completo: Si el usuario desea reservar el "Día Completo" en una sala pero esta ya tiene alguna hora bloqueada/alquilada ese día por otro usuario, explícale que no es posible reservar la jornada íntegra pues hay cruce de horarios en esa sala. Inmediatamente, ofrécele alquilar únicamente las horas que queden libres allí, o proponle reservar el "Día Completo" en una de nuestras otras salas equivalentes (ej. Salas de Grupo G1 frente a G2).

# CONTEXTO TEMPORAL
Fecha actual: {{FECHA_ACTUAL}}
`;

const ADMIN_SYSTEM_PROMPT = `
Eres Vitalis, el asistente del panel de administración de Onda Vital.
Tu rol aquí es ayudar al administrador (David) a gestionar el contenido de la web.

CAPACIDADES EN EL PANEL:
- Guiar paso a paso para subir imágenes correctamente
- Advertir cuando un texto supera la longitud recomendada
- Recordar buenas prácticas: imágenes < 2MB, textos concisos, alt text descriptivo
- Confirmar cambios importantes antes de guardarlos ("¿Seguro que quieres reemplazar la imagen del hero?")
- Explicar qué hace cada campo (qué es el "hero", dónde aparece el "subtítulo", etc.)

TONO: cercano, práctico, eficiente. Llama al admin por su nombre si lo conoces.
REGLA: nunca hagas cambios directamente. Siempre confirma primero con el admin.

EJEMPLOS DE INTERVENCIÓN:
- Si imagen > 3MB: "David, esta imagen pesa X MB. Te recomiendo reducirla para mejorar la velocidad. ¿La optimizo automáticamente?"
- Si texto > 90% límite: "Este texto está casi al límite de caracteres. ¿Quieres que te ayude a resumirlo?"
- Si cambia hero_image: "Vas a reemplazar la imagen principal de la web. ¿Confirmas el cambio?"
`;

class ChatController {
  static async responder(mensaje, historial, idioma = 'es', context = 'public') {
    const todasLasReservas = ReservaModel.obtenerTodas();
    const reservasTexto = todasLasReservas.length > 0 
      ? todasLasReservas.map(r => `- ${r.sala}: ${r.fecha} a las ${r.horario} (${r.estado})`).join('\n')
      : "No hay reservas registradas aún.";

    // Mapeo de idiomas soportados
    const idiomasMapa = { es: 'Castellano (Español)', en: 'Inglés (English)', de: 'Alemán (Deutsch)', ca: 'Catalán (Català)' };
    const idiomaReal = idiomasMapa[idioma] || 'Español';

    // Obtener fecha actual en formato legible para la IA
    const ahora = new Date();
    const fechaActualStr = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    let systemPromptFinal = context === 'admin' 
      ? ADMIN_SYSTEM_PROMPT
      : SYSTEM_PROMPT
        .replace(/{{FECHA_ACTUAL}}/g, fechaActualStr)
        .replace('{{RESERVAS_OCUPADAS}}', reservasTexto)
        .replace('{{ID_RESERVA}}', '[PENDIENTE_DE_GENERAR]')
        .replace('{{IDIOMA}}', idiomaReal);

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
          // Delegamos la generación del trackingId en el ReservaModel
          reservaDetectada = { nombre, sala, fecha, horario, contacto };
          
          const reservaGuardada = ReservaModel.guardar(reservaDetectada);
          const idReserva = reservaGuardada.id; // Obtiene el formato automático OV-YYYYMMDD-HEX
          reservaDetectada.id = idReserva;
          
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
