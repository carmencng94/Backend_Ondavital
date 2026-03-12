// Controller: ReservaController.js
// Propósito: Orquestar la lógica de creación de reservas manuales vía API.

const ReservaModel = require('../models/ReservaModel');

class ReservaController {
  /**
   * Crea una nueva reserva basada en los datos recibidos.
   * Extrae la validación y llama al modelo para persistir.
   */
  static crearReserva(data) {
    const { nombre, sala, fecha, horario } = data;

    // Validación básica: todos los campos requeridos deben existir
    if (!nombre || !sala || !fecha || !horario) {
      throw new Error("Faltan campos requeridos: nombre, sala, fecha, horario");
    }

    // El Controller delega en el Model el almacenamiento de datos
    const reservaGuardada = ReservaModel.guardar({ nombre, sala, fecha, horario });
    return reservaGuardada;
  }
}

module.exports = ReservaController;
