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

      // Si el usuario seleccionó varias horas (ej: "9:00, 10:00")
      const slots = reserva.horario.split(',').map(s => s.trim()).sort((a, b) => {
        return parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]);
      });
      const firstSlot = slots[0];
      const lastSlot = slots[slots.length - 1];

      // Combinar fecha y hora para el inicio (slot más temprano)
      const startTime = `${reserva.fecha}T${firstSlot.padStart(5, '0')}:00`;
      
      // Calcular hora de fin (sumar 1 hora a la última seleccionada)
      const [horas, minutos] = lastSlot.split(':').map(Number);
      const finHoras = (horas + 1).toString().padStart(2, '0');
      const endTime = `${reserva.fecha}T${finHoras}:${minutos.toString().padStart(2, '0')}:00`;

      const event = {
        summary: `Reserva: ${reserva.sala} - ${reserva.nombre}`,
        location: `Onda Vital - ${reserva.sala}`,
        description: `Reserva creada automáticamente para ${reserva.nombre}.\nContacto: ${reserva.contacto_real || 'No especificado (o encriptado localmente)'}`,
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

  /**
   * Consulta los periodos ocupados ("busy") en el calendario de David.
   * Filtro de Privacidad: Solo devuelve intervalos ocupados sin detalles del evento.
   * @param {string} timeMin - Fecha/hora inicio (ISO string)
   * @param {string} timeMax - Fecha/hora fin (ISO string)
   * @returns {Array} - Array de objetos { start, end }
   */
  async checkBusyPeriods(timeMin, timeMax) {
    try {
      if (!this.calendarId) {
        console.warn('Google Calendar ID no configurado en .env. No se pueden verificar periodos ocupados.');
        return [];
      }

      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          timeZone: 'Europe/Madrid',
          items: [{ id: this.calendarId }],
        },
      });

      const busyPeriods = response.data.calendars[this.calendarId].busy;
      return busyPeriods;
    } catch (error) {
      console.error('Error al consultar periodos ocupados en Google Calendar:', error.message);
      return [];
    }
  }
}

module.exports = new GoogleCalendarService();
