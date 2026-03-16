const { google } = require('googleapis');
const path = require('path');

class GoogleCalendarService {
  constructor() {
    this.SCOPES = ['https://www.googleapis.com/auth/calendar'];
    this.calendarId = process.env.GOOGLE_CALENDAR_ID;
    
    // Configuramos la autenticación usando una cuenta de servicio
    // Se asume que el archivo de credenciales estará en la carpeta config/
    this.auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../config/google-credentials.json'),
      scopes: this.SCOPES,
    });
    
    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  /**
   * Crea un evento en Google Calendar basado en una reserva.
   * @param {Object} reserva - { nombre, sala, fecha, horario }
   */
  async crearEvento(reserva) {
    try {
      if (!this.calendarId) {
        console.warn('Google Calendar ID no configurado en .env. Saltando sincronización.');
        return null;
      }

      // Combinar fecha y hora. Asumimos duración de 1 hora por defecto.
      const startTime = `${reserva.fecha}T${reserva.horario}:00`;
      
      // Calcular hora de fin (sumar 1 hora)
      const [horas, minutos] = reserva.horario.split(':').map(Number);
      const finHoras = (horas + 1).toString().padStart(2, '0');
      const endTime = `${reserva.fecha}T${finHoras}:${minutos.toString().padStart(2, '0')}:00`;

      const event = {
        summary: `Reserva: ${reserva.sala} - ${reserva.nombre}`,
        location: `Onda Vital - ${reserva.sala}`,
        description: `Reserva creada automáticamente para ${reserva.nombre}.`,
        start: {
          dateTime: startTime,
          timeZone: 'Europe/Madrid', 
        },
        end: {
          dateTime: endTime,
          timeZone: 'Europe/Madrid',
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: this.calendarId,
        resource: event,
      });

      console.log('Evento creado en Google Calendar:', response.data.htmlLink);
      return response.data;
    } catch (error) {
      console.error('Error al crear evento en Google Calendar:', error.message);
      // No lanzamos el error para no bloquear la reserva local si falla Google
      return null;
    }
  }
}

module.exports = new GoogleCalendarService();
