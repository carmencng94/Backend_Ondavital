// Controller: ChatController.js

const ReservaModel = require('../models/ReservaModel');
const ChatGateway = require('../chat/ChatGateway');
const ExternalChatProvider = require('../chat/providers/ExternalChatProvider');
const LocalChatProvider = require('../chat/providers/LocalChatProvider');
const OpenRouterProvider = require('../chat/providers/OpenRouterProvider');
const GrokProvider = require('../chat/providers/GrokProvider');
const BookRetrievalService = require('../services/BookRetrievalService');
const { extractDates } = require('../utils/dateParser');

// Importamos los prompts desde el nuevo archivo de configuración
const { SYSTEM_PROMPT, ADMIN_SYSTEM_PROMPT, BOOK_CONTEXT_TEMPLATE } = require('../config/PromptsConfig');

const providerType = process.env.CHAT_PROVIDER || 'openrouter'; 
const fallbackType = process.env.CHAT_FALLBACK || 'none';

// Diccionario centralizado de mensajes de error
const MENSAJES_ERROR = {
    es: 'Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
    en: 'Sorry, an error occurred processing your request. Please try again later.',
    ca: 'Ho sento, va ocórrer un error processant la teva sol·licitud. Intenta-ho de nou més tard.',
    de: 'Entschuldigung, es ist ein Fehler bei der Verarbeitung Ihrer Anfrage aufgetreten. Bitte versuchen Sie es später erneut.'
};

// Mapa centralizado de idiomas
const IDIOMAS_MAPA = { 
    es: 'Castellano (Español)', 
    en: 'Inglés (English)', 
    de: 'Alemán (Deutsch)', 
    ca: 'Catalán (Català)' 
};

function crearProveedor(tipo) {
    switch(tipo) {
        case 'openai': return new ExternalChatProvider();
        case 'openrouter': return new OpenRouterProvider();
        case 'grok': return new GrokProvider();
        case 'local': return new LocalChatProvider();
        default:
            console.warn(`Provider desconocido: ${tipo}, usando Local`);
            return new LocalChatProvider();
    }
}

let mainProvider = crearProveedor(providerType);
let fallbackProvider = fallbackType && fallbackType !== 'none' ? crearProveedor(fallbackType) : null;

const chatGateway = new ChatGateway({
    provider: mainProvider,
    fallbackProvider: fallbackProvider
});

class ChatController {

  /**
   * Responde a un mensaje del usuario integrando historial y contexto documental.
   */
  static async responder(mensaje, historial = [], idioma = 'es', context = 'public') {
    try {
      const systemPromptFinal = this._construirPromptCompleto(mensaje, idioma, context);
      const mensajesParaIA = [{ role: 'system', content: systemPromptFinal }, ...historial];
      
      const resultado = await chatGateway.obtenerRespuesta(mensaje, mensajesParaIA, idioma, context);
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
      return {
        respuesta: MENSAJES_ERROR[idioma] || MENSAJES_ERROR['es'],
        idioma: idioma,
        error: process.env.NODE_ENV === 'production' ? 'Error interno del servidor.' : error.message,
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
    try {
      const systemPromptFinal = this._construirPromptCompleto(mensaje, idioma, context);
      const messages = [{ role: 'system', content: systemPromptFinal }, ...historial, { role: 'user', content: mensaje }];
      
      const resultado = await chatGateway.obtenerRespuesta(mensaje, messages, idioma, context);
      const procesado = this._procesarRespuestaIA(resultado.respuesta);
      return { respuesta: procesado.respuestaFinal, reservaDetectada: procesado.reservaDetectada };
    } catch (error) {
      console.error("Error en ChatController (Legacy):", error);
      throw new Error("Error procesando la consulta.");
    }
  }

  /**
   * Construye el System Prompt ensamblando configuración, fechas, idiomas y contexto RAG.
   * @private
   */
  static _construirPromptCompleto(mensaje, idioma, context) {
    if (context === 'admin') return ADMIN_SYSTEM_PROMPT;

    // 1. Obtener datos dinámicos (Reservas filtradas por fecha o rango, e Idioma)
    const fechasInteres = extractDates(mensaje);
    let reservas = [];
    let calendarWindowStr = "";

    const today = new Date();
    const format = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (fechasInteres && fechasInteres.length > 0) {
      reservas = ReservaModel.obtenerPorFechas ? ReservaModel.obtenerPorFechas(fechasInteres) : [];
      calendarWindowStr = fechasInteres.join(', ');
    } else {
      const fechaInicio = format(today);
      const targetEnd = new Date(today);
      targetEnd.setDate(today.getDate() + 7);
      const fechaFin = format(targetEnd);
      reservas = ReservaModel.obtenerPorRangoFechas ? ReservaModel.obtenerPorRangoFechas(fechaInicio, fechaFin) : [];
      calendarWindowStr = `${fechaInicio} a ${fechaFin}`;
    }

    const reservasTexto = reservas.length > 0 
      ? reservas.map(r => `[OCUPADA] Sala: ${r.sala} | Fecha: ${r.fecha} | Horario: ${r.horario} | Estado: ${r.estado}`).join('\n')
      : "No hay reservas registradas en este periodo.";

    const idiomaReal = IDIOMAS_MAPA[idioma] || 'Español';
    const fechaActualStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // 2. Reemplazar variables en el prompt base
    let promptBase = SYSTEM_PROMPT
      .replace(/{{FECHA_ACTUAL}}/g, fechaActualStr)
      .replace('{{RESERVAS_OCUPADAS}}', reservasTexto)
      .replace('{{ID_RESERVA}}', '[PENDIENTE_DE_GENERAR]')
      .replace('{{IDIOMA}}', idiomaReal);

    // Inyectar anotación explícita de la ventana de reservas visible para la IA
    promptBase += `\n\n[NOTA DE CONTEXTO - CALENDARIO]: Actualmente estás visualizando únicamente las reservas del periodo/fechas: [${calendarWindowStr}]. Si el cliente solicita reservar o consultar disponibilidad para una fecha que NO se encuentra explícitamente listada en este rango, pídele amablemente que te indique el día deseado para actualizar tu calendario.`;

    // 3. Inyectar contexto documental (RAG) si aplica
    if (context === 'public') {
      const chunks = BookRetrievalService.buscar(mensaje, 3);
      if (chunks && chunks.length > 0) {
        const fragmentosFormateados = chunks.map(c => `[Página ${c.page_num}]: ${c.content}`).join('\n\n');
        const contextoRAG = BOOK_CONTEXT_TEMPLATE.replace('{{FRAGMENTOS}}', fragmentosFormateados);
        promptBase += `\n\n${contextoRAG}`;
      }
    }

    return promptBase;
  }

  /**
   * Enruta el procesamiento de la respuesta según las etiquetas encontradas.
   * @private
   */
  static _procesarRespuestaIA(respuestaTexto) {
    // 1. Detección de Consulta de Reserva
    // Regex mejorada: insensible a mayúsculas/minúsculas y tolerante a espacios en blanco
    const matchConsulta = respuestaTexto.match(/\[\s*CONSULTAR_RESERVA\s*:\s*([^\]]+)\s*\]/i);
    if (matchConsulta) {
      return this._procesarConsultaEstado(matchConsulta[1].trim());
    }

    // 2. Detección de Creación de Reserva
    // Regex mejorada: insensible a mayúsculas/minúsculas, captura el contenido de la etiqueta de forma flexible
    const matchReserva = respuestaTexto.match(/\[\s*RESERVA_LISTA\s*:\s*([^\]]+)\s*\]/i);
    if (matchReserva) {
      return this._procesarCreacionReserva(matchReserva, respuestaTexto);
    }

    // Si no hay etiquetas, devolver la respuesta sin alteraciones
    return { respuestaFinal: respuestaTexto, reservaDetectada: null };
  }

  /**
   * Maneja la lógica específica para consultar una reserva existente.
   * @private
   */
  static _procesarConsultaEstado(codigo) {
    const reserva = ReservaModel.obtenerPorId ? ReservaModel.obtenerPorId(codigo) : null;
    
    if (reserva) {
      return { 
        respuestaFinal: `He encontrado tu reserva, ${reserva.nombre}. Tienes reservada la **${reserva.sala}** para el día **${reserva.fecha}** a las **${reserva.horario}**. El estado actual es: **${reserva.estado}**.`, 
        reservaDetectada: null 
      };
    } 
    
    return { 
      respuestaFinal: `Lo siento, no he podido encontrar ninguna reserva con el código **${codigo}**. Por favor, verifica el código o contacta directamente con David.`, 
      reservaDetectada: null 
    };
  }

  /**
   * Maneja la lógica específica para crear y validar una nueva reserva.
   * @private
   */
  static _procesarCreacionReserva(matchReserva, respuestaOriginal) {
    const fields = matchReserva[1].split('|').map(s => s.trim());

    // Asignar campos basándose en el orden recibido de manera flexible
    const nombre = fields[0] || '';
    const sala = fields[1] || '';
    const fecha = fields[2] || '';
    const horario = fields[3] || '';
    let email = fields[4] || '';
    let telefono = fields[5] || '';

    // Si el asistente envía exactamente 5 campos, deducimos de manera robusta si el 5º campo es un teléfono o email
    if (fields.length === 5) {
      if (email.includes('@')) {
        telefono = '';
      } else {
        telefono = email;
        email = '';
      }
    }

    const contacto = telefono || email;

    // Validación de integridad de datos (Regla de mínimo dos palabras para el Nombre Completo)
    if (nombre.split(/\s+/).filter(Boolean).length < 2) {
      return { 
        respuestaFinal: "Por favor, indícame tu nombre y apellidos completos para poder procesar la reserva correctamente.",
        reservaDetectada: null 
      };
    }

    // Primero comprobamos si ya existe una reserva idéntica para evitar el error de auto-solapamiento
    const existente = ReservaModel.obtenerExistente ? ReservaModel.obtenerExistente(nombre, sala, fecha, horario) : null;
    
    let reservaGuardada;
    let reservaDetectada;

    if (existente) {
      // Si ya existe una pre-reserva idéntica (mismo nombre, sala, fecha y horario), la reutilizamos
      reservaDetectada = {
        id: existente.id,
        nombre: existente.nombre,
        sala: existente.sala,
        fecha: existente.fecha,
        horario: existente.horario,
        contacto: existente.contacto_real || existente.contacto || contacto,
        email: email, // Mantenemos los campos de email/telefono para el frontend
        telefono: telefono
      };
      reservaGuardada = existente;
    } else {
      // Si no existe, hacemos la verificación de disponibilidad normal
      const disponible = ReservaModel.verificarDisponibilidad ? ReservaModel.verificarDisponibilidad(sala, fecha, horario) : true;
      
      if (!disponible) {
        return {
          respuestaFinal: `Disculpa, acabo de verificar que la ${sala} para el ${fecha} a las ${horario} ya no está disponible. ¿Te gustaría buscar otra fecha o sala?`,
          reservaDetectada: null
        };
      }

      // Guardado de la nueva reserva
      reservaDetectada = { nombre, sala, fecha, horario, email, telefono, contacto };
      reservaGuardada = ReservaModel.guardar ? ReservaModel.guardar(reservaDetectada) : { id: 'OV-' + Date.now() };
      reservaDetectada.id = reservaGuardada.id;
    }

    // Limpieza de la etiqueta en la respuesta final
    const respuestaLimpia = respuestaOriginal
      .replace(matchReserva[0], '')
      .replace('[PENDIENTE_DE_GENERAR]', reservaGuardada.id)
      .replace(/\[PEND-.+?\]/g, reservaGuardada.id)
      .trim();

    return { respuestaFinal: respuestaLimpia, reservaDetectada };
  }
}

module.exports = ChatController;
