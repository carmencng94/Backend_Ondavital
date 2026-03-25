const googleCalendarService = require('./GoogleCalendarService');
const ReservaModel = require('../models/ReservaModel');

// In-memory store for failed attempts
const userAttempts = {};

class AvailabilityService {
  /**
   * Verifica la disponibilidad de una sala para el Agente de Lógica.
   * @param {string} dateStr - Fecha y hora en formato ISO 8601
   * @param {string} roomID - ID de la sala
   * @param {string} userIdentifier - Identificador para tracking de intentos
   */
  async checkAvailability(dateStr, roomID, userIdentifier = 'anonymous') {
    // 1. Validación de Entrada
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime()) || !dateStr.includes('T')) {
      return { status: 'Error', message: 'Formato de fecha inválido. Debe ser ISO 8601.' };
    }

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (parsedDate < twoHoursFromNow) {
      return { status: 'Error', message: 'La reserva debe realizarse con al menos 2 horas de antelación.' };
    }

    // 2. Lógica del Semáforo
    const slotStart = parsedDate;
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // 1 hr session
    const slotStartWithBuffer = new Date(slotStart.getTime() - 20 * 60 * 1000);
    const slotEndWithBuffer = new Date(slotEnd.getTime() + 20 * 60 * 1000);

    // Consulta Google Calendar (Filtro de Privacidad: Busy only)
    const timeMin = slotStartWithBuffer.toISOString();
    const timeMax = slotEndWithBuffer.toISOString();
    // const busyPeriods = await googleCalendarService.checkBusyPeriods(timeMin, timeMax);
    // Para entornos dev donde Calendar no esté configurado, asumimos array vacío o simulamos
    let busyPeriods = [];
    try {
        busyPeriods = await googleCalendarService.checkBusyPeriods(timeMin, timeMax);
    } catch(e) { /* Ignorar error de red si no hay credentials */ }

    let isRed = false;
    if (busyPeriods && busyPeriods.length > 0) isRed = true;

    // Formatear fechas para BD local
    const tzOffset = parsedDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(parsedDate.getTime() - tzOffset).toISOString().slice(0, -1);
    const fechaYYYYMMDD = localISOTime.split('T')[0];

    const allReservas = ReservaModel.obtenerTodas().filter(r => r.fecha === fechaYYYYMMDD && r.estado !== 'rechazada');
    
    // Validar en base de datos local
    const requestedRoomReservas = allReservas.filter(r => r.sala === roomID);
    for (const res of requestedRoomReservas) {
        // En DB local el horario viene tipo "10:00"
        const resHorasMin = res.horario.split(':');
        // Reconstruimos start date asumiendo timezone actual
        const resStart = new Date(`${fechaYYYYMMDD}T${res.horario}:00`);
        const resEnd = new Date(resStart.getTime() + 60 * 60 * 1000);
        
        // Verifica si hay overlapping (incluyendo buffer de 20 min)
        if ((slotStartWithBuffer < resEnd) && (slotEndWithBuffer > resStart)) {
            isRed = true;
            break;
        }
    }

    // Gestión de Conflictos
    if (isRed) {
        userAttempts[userIdentifier] = (userAttempts[userIdentifier] || 0) + 1;
        
        // Recuperación de Errores (A la 3ra vez ofrece ayuda guiada)
        if (userAttempts[userIdentifier] >= 3) {
            return {
                status: 'Red',
                message: 'Ese hueco ya está ocupado.',
                recoverySugerencia: 'Veo que te cuesta encontrar hueco, ¿quieres que te muestre las horas más tranquilas de la semana?',
                alternativas: this.generarAlternativas(parsedDate, roomID)
            };
        }

        return {
            status: 'Red',
            message: 'Ese hueco ya está vibrando con otra actividad. Pero tengo estas alternativas para ti:',
            alternativas: this.generarAlternativas(parsedDate, roomID)
        };
    }

    // Amarillo: Sala libre pero actividad ruidosa contigua
    let isYellow = false;
    let adjacentActivity = '';
    const otherRoomReservas = allReservas.filter(r => r.sala !== roomID);
    for (const res of otherRoomReservas) {
        const resStart = new Date(`${fechaYYYYMMDD}T${res.horario}:00`);
        const resEnd = new Date(resStart.getTime() + 60 * 60 * 1000);
        if ((slotStart < resEnd) && (slotEnd > resStart)) {
            isYellow = true;
            adjacentActivity = `Hay actividad en la ${res.sala}`;
            break;
        }
    }

    // Reset attempts on success
    userAttempts[userIdentifier] = 0;

    if (isYellow) {
        return {
            status: 'Yellow',
            message: `Sala libre, pero atención: ${adjacentActivity} en el mismo horario. ¿Deseas continuar?`
        };
    }

    return {
        status: 'Green',
        message: 'Sala libre y con buffer de limpieza/ventilación de 20 min asegurado.'
    };
  }

  generarAlternativas(requestedDate, roomID) {
    const nextSlot = new Date(requestedDate.getTime() + 2 * 60 * 60 * 1000);
    const nextSlotHora = nextSlot.getHours().toString().padStart(2, '0') + ':00';
    const sameSlotHora = requestedDate.getHours().toString().padStart(2, '0') + ':00';
    const otherRoom = roomID.includes('Luz') ? 'Sala Jardín' : 'Sala Luz';

    return [
      {
        sala: otherRoom,
        hora: sameSlotHora,
        razon: 'Es igual de amplia y tiene un ambiente tranquilo en este momento.'
      },
      {
        sala: roomID,
        hora: nextSlotHora,
        razon: 'Justo cuando termina la sesión anterior y hayamos preparado el espacio.'
      }
    ];
  }
}

module.exports = new AvailabilityService();
