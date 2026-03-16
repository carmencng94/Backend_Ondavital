const ReservaModel = require('../models/ReservaModel');
const { reservaSchema } = require('../validations/reservaValidation');
const googleCalendarService = require('../services/GoogleCalendarService');

class ReservaController {
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
}

module.exports = ReservaController;
