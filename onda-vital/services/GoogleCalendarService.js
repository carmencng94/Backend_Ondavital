const { google } = require('googleapis');
const path = require('path');

class GoogleCalendarService {
  constructor() {
    this.SCOPES = ['https://www.googleapis.com/auth/calendar'];
    this.calendarId = process.env.GOOGLE_CALENDAR_ID;
    
    // Autenticación: Prioriza variable de entorno (Railway) o usa archivo local (Dev)
    let authOptions = { scopes: this.SCOPES };
    
    if (process.env.GOOGLE_CREDENTIALS_JSON) {
      // Para Railway: Se pega el contenido completo del JSON en la variable de entorno
      authOptions.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    } else {
      // Para Local: Carga el archivo ignorado en el .gitignore
      authOptions.keyFile = path.join(__dirname, '../config/google-credentials.json');
    }

    this.auth = new google.auth.GoogleAuth(authOptions);
    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  /**
   * Parsea un string de horario (con soporte para rangos, slots individuales y listas separadas por comas)
   * y retorna las horas de inicio y fin en formato HH:MM
   * @private
   */
  parseHorario(horarioStr) {
    if (!horarioStr) return { start: '09:00', end: '10:00' };
    
    const cleanStr = horarioStr.trim();
    
    if (cleanStr.includes(',')) {
      const slots = cleanStr.split(',').map(s => s.trim()).sort((a, b) => {
        return parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]);
      });
      const first = slots[0];
      const last = slots[slots.length - 1];
      
      const [h, m] = last.split(':').map(Number);
      let endH = h + 1;
      let endM = m || 0;
      
      const result = {
        start: first.padStart(5, '0'),
        end: `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
      };
      
      if (endH >= 24) {
        result.end = '23:59';
      }
      return result;
    }
    
    const timeRegex = /\b(\d{1,2}):(\d{2})\b/g;
    const matches = [...cleanStr.matchAll(timeRegex)].map(m => m[0]);
    
    if (matches.length >= 2) {
      const start = matches[0].padStart(5, '0');
      const end = matches[matches.length - 1].padStart(5, '0');
      const [endH] = end.split(':').map(Number);
      
      const result = { start, end };
      if (endH >= 24) {
        result.end = '23:59';
      }
      return result;
    } else if (matches.length === 1) {
      const start = matches[0];
      const [h, m] = start.split(':').map(Number);
      let endH = h + 1;
      let endM = m || 0;
      
      const result = {
        start: start.padStart(5, '0'),
        end: `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
      };
      
      if (endH >= 24) {
        result.end = '23:59';
      }
      return result;
    }
    
    const hourMatches = [...cleanStr.matchAll(/\b(\d{1,2})\b/g)].map(m => parseInt(m[1], 10));
    if (hourMatches.length >= 2) {
      const startH = hourMatches[0].toString().padStart(2, '0');
      const endH = hourMatches[hourMatches.length - 1].toString().padStart(2, '0');
      const result = {
        start: `${startH}:00`,
        end: `${endH}:00`
      };
      if (parseInt(endH, 10) >= 24) {
        result.end = '23:59';
      }
      return result;
    } else if (hourMatches.length === 1) {
      const startH = hourMatches[0].toString().padStart(2, '0');
      const endH = (hourMatches[0] + 1).toString().padStart(2, '0');
      const result = {
        start: `${startH}:00`,
        end: `${endH}:00`
      };
      if (parseInt(endH, 10) >= 24) {
        result.end = '23:59';
      }
      return result;
    }

    return { start: '09:00', end: '10:00' };
  }

  /**
   * Normaliza una fecha a formato YYYY-MM-DD
   * @private
   */
  parseFecha(fechaStr) {
    if (!fechaStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      return fechaStr;
    }
    const match = fechaStr.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
    if (match) {
      const day = match[1].padStart(2, '0');
      const month = match[2].padStart(2, '0');
      const year = match[3];
      return `${year}-${month}-${day}`;
    }
    return fechaStr;
  }

  /**
   * Crea un evento en Google Calendar basado en una reserva.
   * @param {Object} reserva - { id, nombre, sala, fecha, horario }
   */
  async crearEvento(reserva) {
    try {
      if (!this.calendarId) {
        console.warn('Google Calendar ID no configurado en .env. Saltando sincronización.');
        return null;
      }

      const { start, end } = this.parseHorario(reserva.horario);
      const fechaParsed = this.parseFecha(reserva.fecha);

      const startTime = `${fechaParsed}T${start}:00`;
      const endTime = `${fechaParsed}T${end}:00`;

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
        extendedProperties: {
          private: {
            origin: 'ondavital',
            reservaId: reserva.id || ''
          }
        }
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
   * Actualiza un evento existente en Google Calendar.
   * @param {string} eventId - ID del evento a actualizar
   * @param {Object} reserva - { id, nombre, sala, fecha, horario }
   */
  async actualizarEvento(eventId, reserva) {
    try {
      if (!this.calendarId) {
        console.warn('Google Calendar ID no configurado en .env. Saltando actualización.');
        return null;
      }
      if (!eventId) {
        console.warn('No se proporcionó un eventId para actualizar en Google Calendar.');
        return null;
      }

      const { start, end } = this.parseHorario(reserva.horario);
      const fechaParsed = this.parseFecha(reserva.fecha);

      const startTime = `${fechaParsed}T${start}:00`;
      const endTime = `${fechaParsed}T${end}:00`;

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
        extendedProperties: {
          private: {
            origin: 'ondavital',
            reservaId: reserva.id || ''
          }
        }
      };

      const response = await this.calendar.events.update({
        calendarId: this.calendarId,
        eventId: eventId,
        resource: event,
      });

      console.log(`Evento ${eventId} actualizado en Google Calendar con éxito.`);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar evento ${eventId} en Google Calendar:`, error.message);
      return null;
    }
  }

  /**
   * Elimina un evento de Google Calendar.
   * @param {string} eventId - ID del evento a eliminar
   */
  async eliminarEvento(eventId) {
    try {
      if (!this.calendarId) {
        console.warn('Google Calendar ID no configurado en .env. Saltando eliminación.');
        return false;
      }
      if (!eventId) {
        console.warn('No se proporcionó un eventId para eliminar de Google Calendar.');
        return false;
      }

      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: eventId,
      });

      console.log(`Evento ${eventId} de Google Calendar eliminado con éxito.`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar evento ${eventId} de Google Calendar:`, error.message);
      return false;
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
