const ReservaModel = require('../models/ReservaModel');
const SalaModel = require('../models/SalaModel');
const { reservaSchema } = require('../validations/reservaValidation');
const googleCalendarService = require('../services/GoogleCalendarService');
const availabilityService = require('../services/AvailabilityService');

class ReservaController {
  
  /**
   * Genera la disponibilidad de una sala para una fecha por slots de 60m.
   * Inspirado en la lógica PropTech
   */
  static async getDisponibilidadSlots(salaId, fechaDateStr) {
    // Horario de operaciones: 9:00 a 21:00 (12 slots)
    const allSlots = Array.from({length: 12}).map((_, i) => `${i+9}:00`);
    
    // Todas las reservas locales en esta fecha
    const reservasDia = ReservaModel.obtenerTodas().filter(r => 
      r.fecha === fechaDateStr && 
      (r.sala === salaId || r.sala.includes(salaId)) &&
      r.estado !== 'rechazada'
    );

    // Consulta Google Calendar para el día completo (Filtro de Privacidad)
    // Definimos el rango del día de 00:00 a 23:59
    const timeMin = `${fechaDateStr}T00:00:00Z`;
    const timeMax = `${fechaDateStr}T23:59:59Z`;
    let busyPeriods = [];
    try {
      busyPeriods = await googleCalendarService.checkBusyPeriods(timeMin, timeMax);
    } catch (e) {
      console.error("Error al consultar Google Calendar para el grid:", e.message);
    }
    
    // Mapeo
    const slotsResponse = allSlots.map(time => {
      // 1. Verificar reserva local
      const slotUtilizadoLocal = reservasDia.some(reserva => {
         return reserva.horario.includes(time);
      });

      // 2. Verificar Google Calendar (Busy periods)
      // Cada slot dura 1 hora. Reconstruimos el objeto Date para comparar.
      const slotStart = new Date(`${fechaDateStr}T${time.padStart(5, '0')}:00Z`);
      const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000);

      const slotOcupadoGoogle = busyPeriods.some(period => {
        const busyStart = new Date(period.start);
        const busyEnd = new Date(period.end);
        // Solapamiento: (StartA < EndB) y (EndA > StartB)
        return (slotStart < busyEnd) && (slotEnd > busyStart);
      });

      return {
        time,
        status: (slotUtilizadoLocal || slotOcupadoGoogle) ? 'busy' : 'free'
      };
    });

    return { success: true, salaId, fecha: fechaDateStr, slots: slotsResponse };
  }

  /**
   * Obtiene TODAS las reservas (locales y de Google) para un día específico
   * Útil para la vista global del calendario.
   */
  static async getDisponibilidadGlobal(fechaDateStr) {
    const reservasDia = ReservaModel.obtenerTodas().filter(r => 
      r.fecha === fechaDateStr && r.estado !== 'rechazada'
    );

    const timeMin = `${fechaDateStr}T00:00:00Z`;
    const timeMax = `${fechaDateStr}T23:59:59Z`;
    let busyPeriods = [];
    try {
      busyPeriods = await googleCalendarService.checkBusyPeriods(timeMin, timeMax);
    } catch (e) {
      console.error("Error al consultar Google Calendar:", e.message);
    }

    // Mapa de qué está ocupado, devolvemos las reservas locales "anonimizadas" (solo hora y sala) 
    // y los periodos de Google.
    const ocupaciones = reservasDia.map(r => ({
      sala: r.sala,
      horario: r.horario
    }));

    const googleOcupaciones = busyPeriods.map(p => {
      const d = new Date(p.start);
      return {
        sala: 'Calendario de David',
        horario: `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
      };
    });

    return { 
      success: true, 
      fecha: fechaDateStr, 
      ocupaciones: [...ocupaciones, ...googleOcupaciones] 
    };
  }

  /**
   * Crea una nueva reserva basada en los datos recibidos.
   * Extrae la validación y llama al modelo para persistir.
   */
  static async crearReserva(data) {
    // Validación con Joi
    const { error, value } = reservaSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { nombre, sala, fecha, horario } = value;

    // Validar si la sala está ocupada en ese horario
    const disponible = ReservaModel.verificarDisponibilidad(sala, fecha, horario);
    if (!disponible) {
      throw new Error(`La ${sala} ya está ocupada el ${fecha} a las ${horario}.`);
    }

    // El Controller delega en el Model el almacenamiento de datos
    const reservaGuardada = ReservaModel.guardar({ nombre, sala, fecha, horario });

    // NOTA: No enviamos a Google Calendar todavía, porque está pendiente de David.
    console.log(`Nueva reserva pendiente de David: ${reservaGuardada.id}`);

    return reservaGuardada;
  }

  /**
   * David confirma la reserva. Se cambia el estado y se envía a Google Calendar.
   */
  static async confirmarReserva(id) {
    const reserva = ReservaModel.obtenerPorId(id);
    if (!reserva) throw new Error("Reserva no encontrada");
    if (reserva.estado === 'confirmada') throw new Error("La reserva ya está confirmada");

    // Actualizar base de datos local
    ReservaModel.actualizarEstado(id, 'confirmada');

    // Ahora sí, sincronizar con Google Calendar
    const googleEvent = await googleCalendarService.crearEvento(reserva);
    
    return { 
      success: true, 
      id, 
      nuevoEstado: 'confirmada',
      googleEventLink: googleEvent ? googleEvent.htmlLink : 'no configurado'
    };
  }

  /**
   * David rechaza la reserva.
   */
  static rechazarReserva(id) {
    const reserva = ReservaModel.obtenerPorId(id);
    if (!reserva) throw new Error("Reserva no encontrada");
    
    ReservaModel.actualizarEstado(id, 'rechazada');
    return { success: true, id, nuevoEstado: 'rechazada' };
  }

  /**
   * Verifica la disponibilidad utilizando el semáforo y alternativas (Agente de Lógica).
   */
  static async checkAvailability(req) {
    const { date, roomID, userIdentifier } = req.body;
    if (!date || !roomID) {
      throw new Error("Faltan parámetros 'date' o 'roomID'");
    }
    return await availabilityService.checkAvailability(date, roomID, userIdentifier);
  }

  /**
   * Webhook para sincronización bidireccional con Google. Si un evento se borra, liberar sala.
   */
  static async handleCalendarWebhook(req) {
    console.log("Webhook de Google Calendar recibido");
    // La cabecera "x-goog-resource-state" tiene el valor (sync, exists, etc.)
    // Aquí implementamos el pull de eventos actualizados (delta) y cancelamos reservas asociadas si fueron borradas en Google.
    return { success: true, status: "webhook accepted" };
  }
}

module.exports = ReservaController;
