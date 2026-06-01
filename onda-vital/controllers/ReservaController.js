const ReservaModel = require('../models/ReservaModel');
const SalaModel = require('../models/SalaModel');
const { reservaSchema } = require('../validations/reservaValidation');
const googleCalendarService = require('../services/GoogleCalendarService');
const availabilityService = require('../services/AvailabilityService');
const { decryptData } = require('../utils/crypto');

class ReservaController {
  
  /**
   * Genera la disponibilidad de una sala para una fecha por slots de 60m.
   * Inspirado en la lógica PropTech
   */
  static async getDisponibilidadSlots(salaId, fechaDateStr) {
    // Horario de operaciones: 9:00 a 21:00 (12 slots)
    const allSlots = Array.from({length: 12}).map((_, i) => `${i+9}:00`);
    
    const cleanStr = (str) => {
      if (!str) return '';
      return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    };
    const targetSalaClean = cleanStr(salaId);

    // Todas las reservas locales en esta fecha
    const reservasDia = ReservaModel.obtenerTodas().filter(r => {
      if (r.fecha !== fechaDateStr || r.estado === 'rechazada') return false;
      const resSalaClean = cleanStr(r.sala);
      return resSalaClean.includes(targetSalaClean) || targetSalaClean.includes(resSalaClean);
    });

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

      // Para evitar problemas con el UTC vs Hora Local del servidor, usamos minutos basados en "Madrid"
      const [slotH, slotM] = time.split(':').map(Number);
      const slotStartMins = slotH * 60 + slotM;
      const slotEndMins = slotStartMins + 60;

      const slotOcupadoGoogle = busyPeriods.some(period => {
        const formatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false });
        
        const bStart = new Date(period.start);
        const bEnd = new Date(period.end);

        const [bsH, bsM] = formatter.format(bStart).split(':').map(Number);
        const busyStartMins = bsH * 60 + bsM;
        
        const [beH, beM] = formatter.format(bEnd).split(':').map(Number);
        // Si el final es a media noche (ej. todo el día), beH es 00 o 24. Si es 00 tras las 23, debería ser 24*60.
        // Hacemos una correción simple si el evento termina al día siguiente a las 00:00
        const busyEndMinsTemp = beH * 60 + beM;
        const busyEndMins = (busyEndMinsTemp === 0 && bsH > 0) ? 24 * 60 : busyEndMinsTemp;

        // Solapamiento: (StartA < EndB) y (EndA > StartB)
        return (slotStartMins < busyEndMins) && (slotEndMins > busyStartMins);
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
      const formatter = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false });
      return {
        sala: 'Calendario de David',
        horario: formatter.format(d)
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

    const { nombre, sala, fecha, horario, contacto, precio } = value;

    // Validar si la sala está ocupada en ese horario
    const disponible = ReservaModel.verificarDisponibilidad(sala, fecha, horario);
    if (!disponible) {
      throw new Error(`La ${sala} ya está ocupada el ${fecha} a las ${horario}.`);
    }

    // El Controller delega en el Model el almacenamiento de datos
    const reservaGuardada = ReservaModel.guardar({ nombre, sala, fecha, horario, contacto, precio });

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

    // Obtener contacto desencriptado para Google Calendar
    const reservaConContacto = ReservaModel.obtenerContactoDesencriptado(id);

    // Ahora sí, sincronizar con Google Calendar
    const googleEvent = await googleCalendarService.crearEvento(reservaConContacto);
    
    if (googleEvent && googleEvent.id) {
      ReservaModel.vincularEventoCalendar(id, googleEvent.id, 'synced');
    }
    
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
  static async rechazarReserva(id) {
    const reserva = ReservaModel.obtenerPorId(id);
    if (!reserva) throw new Error("Reserva no encontrada");
    
    ReservaModel.actualizarEstado(id, 'rechazada');

    if (reserva.google_event_id) {
      await googleCalendarService.eliminarEvento(reserva.google_event_id);
      ReservaModel.vincularEventoCalendar(id, null, 'cancelled');
    }

    return { success: true, id, nuevoEstado: 'rechazada' };
  }

  /**
   * Obtiene todas las reservas (para Panel de Administrador)
   * Desencripta el contacto para que David lo vea.
   */
  static async listarTodas() {
    const rawReservas = ReservaModel.obtenerTodas();
    
    return rawReservas.map(r => ({
      ...r,
      contacto: decryptData(r.contacto)
    }));
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
    
    // Si es un ping de sincronización inicial, lo aceptamos directamente
    const resourceState = req.headers['x-goog-resource-state'];
    if (resourceState === 'sync') {
      return { success: true, status: "sync channel accepted" };
    }

    try {
      if (!googleCalendarService.calendarId) {
        return { success: false, error: "Calendar ID no configurado" };
      }

      // 1. Obtener los últimos eventos modificados para procesar la sincronización reactiva
      const response = await googleCalendarService.calendar.events.list({
        calendarId: googleCalendarService.calendarId,
        orderBy: 'updated',
        maxResults: 5,
        singleEvents: true
      });

      const events = response.data.items || [];

      for (const event of events) {
        // 2. Loop Protection: Verificar si el evento fue creado por Onda Vital
        const origin = event.extendedProperties?.private?.origin;
        const localId = event.extendedProperties?.private?.reservaId;

        if (origin === 'ondavital' && localId) {
          const reservaLocal = ReservaModel.obtenerPorId(localId);

          if (reservaLocal) {
            // A. Caso: El evento fue cancelado en el Calendario
            if (event.status === 'cancelled') {
              if (reservaLocal.estado !== 'rechazada') {
                console.log(`Webhook: Evento borrado en Google Calendar. Cancelando reserva local ${localId}`);
                ReservaModel.actualizarEstado(localId, 'rechazada');
                ReservaModel.vincularEventoCalendar(localId, null, 'cancelled');
              }
              continue;
            }

            // B. Caso: El evento fue modificado (reprogramado) en el Calendario
            const startDateTime = event.start.dateTime;
            const endDateTime = event.end.dateTime;

            if (startDateTime && endDateTime) {
              const startPart = startDateTime.split('T');
              const newFecha = startPart[0]; // AAAA-MM-DD
              
              // Reconstruir slots basados en la diferencia de horas
              const sHour = parseInt(startPart[1].split(':')[0], 10);
              const eHour = parseInt(endDateTime.split('T')[1].split(':')[0], 10);

              const slots = [];
              for (let h = sHour; h < eHour; h++) {
                slots.push(`${h}:00`);
              }
              const newHorario = slots.join(', ');

              // Evitar sync-loop comparando valores reales
              if (reservaLocal.fecha !== newFecha || reservaLocal.horario !== newHorario) {
                // Verificar colisiones antes de reprogramar
                const disponible = ReservaModel.verificarDisponibilidad(reservaLocal.sala, newFecha, newHorario);

                if (disponible) {
                  console.log(`Webhook: Reprogramando reserva local ${localId} a ${newFecha} (${newHorario})`);
                  ReservaModel.reprogramarReserva(localId, newFecha, newHorario);
                } else {
                  console.warn(`Webhook: Conflicto de salas para mover ${localId}. Deshaciendo cambio en Google Calendar...`);
                  const reservaConContacto = ReservaModel.obtenerContactoDesencriptado(localId);
                  await googleCalendarService.actualizarEvento(reservaLocal.google_event_id, reservaConContacto);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error procesando webhook de Google Calendar:", err.message);
    }

    return { success: true, status: "webhook accepted" };
  }
}

module.exports = ReservaController;
