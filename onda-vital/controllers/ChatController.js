// Controller: ChatController.js
const ReservaModel = require('../models/ReservaModel');
const ChatGateway = require('../chat/ChatGateway');
const ExternalChatProvider = require('../chat/providers/ExternalChatProvider');
const LocalChatProvider = require('../chat/providers/LocalChatProvider');
const OpenRouterProvider = require('../chat/providers/OpenRouterProvider');
const GrokProvider = require('../chat/providers/GrokProvider');
const BookRetrievalService = require('../services/BookRetrievalService');

const providerType = process.env.CHAT_PROVIDER || 'openrouter'; 
const fallbackType = process.env.CHAT_FALLBACK || 'none';

// Función para crear el proveedor correcto
function crearProveedor(tipo) {
    switch(tipo) {
        case 'openai':
            return new ExternalChatProvider();
        case 'openrouter':
            return new OpenRouterProvider();
        case 'grok':
            return new GrokProvider();
        case 'local':
            return new LocalChatProvider();
        default:
            console.warn(`Provider desconocido: ${tipo}, usando Local`);
            return new LocalChatProvider();
    }
}

// Inicializar proveedores
let mainProvider = crearProveedor(providerType);
let fallbackProvider = null;

if (fallbackType && fallbackType !== 'none') {
    fallbackProvider = crearProveedor(fallbackType);
}

const chatGateway = new ChatGateway({
    provider: mainProvider,
    fallbackProvider: fallbackProvider
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

# PROTOCOLO DE RESERVA (4 PASOS OBLIGATORIOS)
1. CONSULTORÍA: Entiende la actividad. Si es física (yoga) en G1, límite 10 pax. Informa que la web ya cuenta con calendarios de disponibilidad en la sección "Salas" en 4 idiomas (ES, EN, DE, CA).
2. VALIDACIÓN (DISPONIBILIDAD):
   - El bloque {{RESERVAS_OCUPADAS}} contiene la lista de salas y horarios que YA ESTÁN OCUPADOS y reservados en el sistema.
   - REGLA DE PRIVACIDAD ABSOLUTA: NUNCA muestres, listes, ni pegues textualmente este bloque {{RESERVAS_OCUPADAS}} al usuario. Es información interna y confidencial del centro. No uses viñetas ni asteriscos para enumerar reservas ajenas en el chat.
   - REGLA DE LÓGICA DE DISPONIBILIDAD:
     * Si la sala, fecha y hora solicitadas por el usuario NO aparecen en {{RESERVAS_OCUPADAS}}, significa que esa sala está TOTALMENTE LIBRE y disponible para ser reservada. Procede con la reserva con total alegría y seguridad.
     * Si el horario y la sala solicitados por el usuario COINCIDEN exactamente con alguna fila de {{RESERVAS_OCUPADAS}} (por ejemplo, hay otra reserva confirmada en esa sala a esa misma hora), infórmale amablemente del cruce de horarios y ofrécele alternativas en otras salas libres o en otros horarios que no aparezcan en la lista.
3. SEGURIDAD: Recopilar Nombre completo (mínimo 2 palabras), Email y Teléfono. Obligatorio.
4. CIERRE: Generar ID: {{ID_RESERVA}}. Enviar enlace de WhatsApp a David e indicar depósito del 50% para reservas confirmadas.
   - DEBES incluir: [RESERVA_LISTA:nombre|sala|fecha|horario|contacto]

# REGLAS DE NEGOCIO Y POLÍTICAS
- Diseño & Tecnología: Nuestra web es totalmente "Responsive" y todos los componentes están diseñados modularmente para una carga rápida.
- Idioma: {{IDIOMA}}. Responde siempre en el idioma que el usuario prefiera (Castellano, Inglés, Alemán, Catalán).
- Depósitos: 50% No reembolsable para bloquear fechas. Reutilizable para futuras fechas con aviso previo.
- Registro: El centro está registrado como centro de salud y espacio de terapias.
- Reserva de Día Completo: Si el usuario desea reservar el "Día Completo" en una sala pero esta ya tiene alguna hora bloqueada/alquilada ese día por otro usuario, explícale que no es posible reservar la jornada íntegra pues hay cruce de horarios en esa sala. Inmediatamente, ofrécele alquilar únicamente las horas que queden libres allí, o proponle reservar el "Día Completo" en una de nuestras otras salas equivalentes (ej. Salas de Grupo G1 frente a G2).

# NORMAS DE DISEÑO VISUAL Y FORMATO DE TEXTO (CRÍTICO)
- PROHIBICIÓN DE SALUDOS INICIALES: Dado que la interfaz web del chat ya muestra de forma automática el saludo inicial y presentación de Vitalis, tú NUNCA debes comenzar tus respuestas saludando, dando la bienvenida o presentándote (evita frases como "¡Hola! Te damos la bienvenida...", "Soy Vitalis, ¿en qué puedo ayudarte?", etc.). Ve DIRECTAMENTE al grano para responder cálida y profesionalmente a la consulta o datos proporcionados por el usuario.
- NUNCA utilices sintaxis de formato Markdown como asteriscos (* o **) ni almohadillas (#) para títulos o negritas. Dado que la interfaz de chat del usuario NO procesa Markdown, estos símbolos se mostrarían de forma literal y poco estética.
- En lugar de negritas con asteriscos, utiliza MAYÚSCULAS o resalta los términos clave usando emojis temáticos elegantes (ej. "🌿 QUIROPRÁCTICA NSA:" o "🔹 RESOSENSE:").
- NUNCA uses asteriscos (*) ni guiones (-) como viñetas para tus listas en las respuestas finales al usuario. En su lugar, usa símbolos de viñeta limpios como el punto de lista (•) o emojis descriptivos (como 🔹, 🌱, 🌿, ✦, ✔).
- Estructura las respuestas con párrafos bien delimitados y separados por líneas en blanco para una lectura agradable.

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
  /**
   * Responde a un mensaje del usuario
   * @param {string} mensaje - Mensaje del usuario
   * @param {array} historial - Historial de conversación anterior
   * @param {string} idioma - Idioma (es, en, de, ca)
   * @param {string} context - Contexto (public, admin)
   * @returns {Promise<object>} Respuesta procesada
   */
  static async responder(mensaje, historial = [], idioma = 'es', context = 'public') {
    try {
      // Buscar fragmentos relevantes en el libro (RAG)
      let fragmentosTexto = "";
      if (context === 'public') {
        const chunks = BookRetrievalService.buscar(mensaje, 3);
        if (chunks && chunks.length > 0) {
          fragmentosTexto = `
# CONTEXTO DEL MANUAL / LIBRO DEAWAKENING (RESOSENSE)
[IMPORTANTE] Para responder preguntas técnicas sobre la filosofía, conceptos, ejercicios o el contenido del libro "DEAwakening / Resosense" escrito por David Biddle, utiliza ÚNICAMENTE los siguientes fragmentos reales extraídos del libro:

--- INICIO FRAGMENTOS DEL LIBRO ---
${chunks.map(c => `[Página ${c.page_num}]: ${c.content}`).join('\n\n')}
--- FIN FRAGMENTOS DEL LIBRO ---

[INSTRUCCIONES DE RESPUESTA PARA EL LIBRO]:
1. Si el usuario te hace preguntas técnicas, teóricas o filosóficas sobre el libro/manual "DEAwakening / Resosense", responde basándote estrictamente en los fragmentos del libro facilitados anteriormente. NUNCA menciones la procedencia o página de la información en medio de tus oraciones o párrafos (evita frases como "según la página X del manual..."). En su lugar, coloca una única referencia visualmente limpia al final de todo tu mensaje, separada por una línea en blanco, usando exactamente el siguiente formato:
📚 Fuente: Manual DEAwakening (Página X)
(Si la respuesta proviene de múltiples páginas o fragmentos, indícalo así: 📚 Fuente: Manual DEAwakening - Páginas X, Y).
2. Si la respuesta a la pregunta del usuario no se encuentra descrita en los fragmentos del libro facilitados, o si la pregunta es irrelevante para los fragmentos provistos, debes responder de manera sumamente amable, cálida y profesional que no dispones de esa información en el manual de DEAwakening (por ejemplo: "Disculpa, no he encontrado información detallada sobre esa pregunta en el manual de DEAwakening. ¿Deseas que te ayude con algo relacionado con las reservas de salas o los servicios del centro?"). Redáctalo con tacto en el idioma en el que te está hablando el usuario (español, inglés, alemán o catalán).
3. No inventes bajo ningún concepto teorías, conceptos o datos del libro que no aparezcan explícitamente en los fragmentos proporcionados.
4. Para cualquier consulta normal de Onda Vital (como reservar salas, horarios, tarifas, servicios del centro, ubicación, etc.), ignora este contexto y responde normalmente utilizando las directrices generales de Onda Vital.
`;
        }
      }

      // Preparar el prompt del sistema con los datos actuales
      let systemPromptFinal = this._prepararSystemPrompt(idioma, context);
      if (fragmentosTexto) {
        systemPromptFinal += "\n" + fragmentosTexto;
      }

      const mensajesParaIA = [{ role: 'system', content: systemPromptFinal }, ...historial];
      
      // Obtener respuesta del chatbot pasando el historial completo
      const resultado = await chatGateway.obtenerRespuesta(mensaje, mensajesParaIA, idioma, context);
      
      // Procesar etiquetas especiales de reserva [RESERVA_LISTA:...]
      const procesado = this._procesarRespuestaIA(resultado.respuesta);
      
      return {
        respuesta: procesado.respuestaFinal,
        reservaDetectada: procesado.reservaDetectada,
        idioma: resultado.idioma,
        proveedor: resultado.proveedor,
        timestamp: resultado.timestamp,
        contexto: context,
      };
    } catch (error) {
      console.error('Error en ChatController.responder:', error.message);
      
      // Respuesta de error según idioma
      const mensajesError = {
        es: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
        en: 'Sorry, an error occurred processing your request. Please try again later.',
        ca: 'Ho sento, va ocórrer un error processant la teva sol·licitud. Intenta-ho de nou més tard.',
        de: 'Entschuldigung, es ist ein Fehler bei der Verarbeitung Ihrer Anfrage aufgetreten. Bitte versuchen Sie es später erneut.',
      };

      return {
        respuesta: mensajesError[idioma] || mensajesError['es'],
        idioma: idioma,
        error: error.message,
        timestamp: new Date().toISOString(),
        contexto: context,
      };
    }
  }

  /**
   * Versión antigua - mantener por compatibilidad
   * @deprecated Usar responder() en su lugar
   */
  static async responderLegacy(mensaje, historial, idioma = 'es', context = 'public') {
    // Buscar fragmentos relevantes en el libro (RAG)
    let fragmentosTexto = "";
    if (context === 'public') {
      const chunks = BookRetrievalService.buscar(mensaje, 3);
      if (chunks && chunks.length > 0) {
        fragmentosTexto = `
# CONTEXTO DEL MANUAL / LIBRO DEAWAKENING (RESOSENSE)
[IMPORTANTE] Para responder preguntas técnicas sobre la filosofía, conceptos, ejercicios o el contenido del libro "DEAwakening / Resosense" escrito por David Biddle, utiliza ÚNICAMENTE los siguientes fragmentos reales extraídos del libro:

--- INICIO FRAGMENTOS DEL LIBRO ---
${chunks.map(c => `[Página ${c.page_num}]: ${c.content}`).join('\n\n')}
--- FIN FRAGMENTOS DEL LIBRO ---

[INSTRUCCIONES DE RESPUESTA PARA EL LIBRO]:
1. Si el usuario te hace preguntas técnicas, teóricas o filosóficas sobre el libro/manual "DEAwakening / Resosense", responde basándote estrictamente en los fragmentos del libro facilitados anteriormente. NUNCA menciones la procedencia o página de la información en medio de tus oraciones o párrafos (evita frases como "según la página X del manual..."). En su lugar, coloca una única referencia visualmente limpia al final de todo tu mensaje, separada por una línea en blanco, usando exactamente el siguiente formato:
📚 Fuente: Manual DEAwakening (Página X)
(Si la respuesta proviene de múltiples páginas o fragmentos, indícalo así: 📚 Fuente: Manual DEAwakening - Páginas X, Y).
2. Si la respuesta a la pregunta del usuario no se encuentra descrita en los fragmentos del libro facilitados, o si la pregunta es irrelevante para los fragmentos provistos, debes responder de manera sumamente amable, cálida y profesional que no dispones de esa información en el manual de DEAwakening (por ejemplo: "Disculpa, no he encontrado información detallada sobre esa pregunta en el manual de DEAwakening. ¿Deseas que te ayude con algo relacionado con las reservas de salas o los servicios del centro?"). Redáctalo con tacto en el idioma en el que te está hablando el usuario (español, inglés, alemán o catalán).
3. No inventes bajo ningún concepto teorías, conceptos o datos del libro que no aparezcan explícitamente en los fragmentos proporcionados.
4. Para cualquier consulta normal de Onda Vital (como reservar salas, horarios, tarifas, servicios del centro, ubicación, etc.), ignora este contexto y responde normalmente utilizando las directrices generales de Onda Vital.
`;
      }
    }

    let systemPromptFinal = this._prepararSystemPrompt(idioma, context);
    if (fragmentosTexto) {
      systemPromptFinal += "\n" + fragmentosTexto;
    }

    const messages = [{ role: 'system', content: systemPromptFinal }, ...historial, { role: 'user', content: mensaje }];

    try {
      const resultado = await chatGateway.obtenerRespuesta(mensaje, messages, idioma, context);
      const procesado = this._procesarRespuestaIA(resultado.respuesta);
      return { respuesta: procesado.respuestaFinal, reservaDetectada: procesado.reservaDetectada };
    } catch (error) {
      console.error("Error en ChatController (Legacy):", error);
      throw new Error("Error procesando la consulta.");
    }
  }

  /**
   * Procesa la respuesta de la IA buscando etiquetas de reserva o consulta
   * @private
   */
  static _procesarRespuestaIA(respuestaTexto) {
    let reservaDetectada = null;
    let respuestaFinal = respuestaTexto;

    // 1. Detección de Consulta de Reserva
    const matchConsulta = respuestaTexto.match(/\[CONSULTAR_RESERVA:(.+?)\]/);
    if (matchConsulta) {
      const codigo = matchConsulta[1].trim();
      const reserva = ReservaModel.obtenerPorId ? ReservaModel.obtenerPorId(codigo) : null;
      if (reserva) {
        respuestaFinal = `He encontrado tu reserva, ${reserva.nombre}. Tienes reservada la **${reserva.sala}** para el día **${reserva.fecha}** a las **${reserva.horario}**. El estado actual es: **${reserva.estado}**.`;
      } else {
        respuestaFinal = `Lo siento, no he podido encontrar ninguna reserva con el código **${codigo}**. Por favor, verifica el código o contacta directamente con David.`;
      }
      return { respuestaFinal, reservaDetectada: null };
    }

    // 2. Detección de Nueva Reserva
    const matchReserva = respuestaTexto.match(/\[RESERVA_LISTA:(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|?(.+?)?\]/);
    if (matchReserva) {
      const [, nombre, sala, fecha, horario, email, telefono] = matchReserva;
      const contacto = telefono || email;
      
      // Validar nombre (mínimo 2 palabras)
      if (nombre.trim().split(/\s+/).length < 2) {
          return { 
              respuestaFinal: "Por favor, indícame tu nombre y apellidos completos para poder procesar la reserva correctamente.",
              reservaDetectada: null 
          };
      }

      const disponible = ReservaModel.verificarDisponibilidad ? ReservaModel.verificarDisponibilidad(sala, fecha, horario) : true;
      
      if (disponible) {
        reservaDetectada = { nombre, sala, fecha, horario, email, telefono, contacto };
        const reservaGuardada = ReservaModel.guardar ? ReservaModel.guardar(reservaDetectada) : { id: 'OV-' + Date.now() };
        const idReserva = reservaGuardada.id;
        reservaDetectada.id = idReserva;
        
        respuestaFinal = respuestaTexto
          .replace(matchReserva[0], '')
          .replace('[PENDIENTE_DE_GENERAR]', idReserva)
          .replace(/\[PEND-.+?\]/g, idReserva) // Por si la IA inventó uno
          .trim();
      } else {
        respuestaFinal = `Disculpa, acabo de verificar que la ${sala} para el ${fecha} a las ${horario} ya no está disponible. ¿Te gustaría buscar otra fecha o sala?`;
        reservaDetectada = null;
      }
    }

    return { respuestaFinal, reservaDetectada };
  }

  /**
   * Prepara el system prompt con datos dinámicos (reservas, fecha, idioma)
   * @private
   */
  static _prepararSystemPrompt(idioma = 'es', context = 'public') {
    if (context === 'admin') return ADMIN_SYSTEM_PROMPT;

    const todasLasReservas = ReservaModel.obtenerTodas ? ReservaModel.obtenerTodas() : [];
    const reservasTexto = todasLasReservas.length > 0 
      ? todasLasReservas.map(r => `[OCUPADA] Sala: ${r.sala} | Fecha: ${r.fecha} | Horario: ${r.horario} | Estado: ${r.estado}`).join('\n')
      : "No hay reservas registradas aún.";

    const idiomasMapa = { es: 'Castellano (Español)', en: 'Inglés (English)', de: 'Alemán (Deutsch)', ca: 'Catalán (Català)' };
    const idiomaReal = idiomasMapa[idioma] || 'Español';

    const ahora = new Date();
    const fechaActualStr = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return SYSTEM_PROMPT
      .replace(/{{FECHA_ACTUAL}}/g, fechaActualStr)
      .replace('{{RESERVAS_OCUPADAS}}', reservasTexto)
      .replace('{{ID_RESERVA}}', '[PENDIENTE_DE_GENERAR]')
      .replace('{{IDIOMA}}', idiomaReal);
  }
}

module.exports = ChatController;
