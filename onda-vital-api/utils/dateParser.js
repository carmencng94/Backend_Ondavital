// utils/dateParser.js
// Propósito: Analizador multilingüe (ES, EN, DE, CA) de fechas absolutas y relativas en texto natural.

/**
 * Extrae una lista de fechas formateadas como AAAA-MM-DD a partir de un texto en lenguaje natural.
 * @param {string} text - Texto del usuario a analizar.
 * @param {Date} [referenceDate=new Date()] - Fecha de referencia para cálculos relativos.
 * @returns {string[]} Array de strings conteniendo las fechas extraídas y ordenadas.
 */
function extractDates(text, referenceDate = new Date()) {
  if (!text) return [];
  
  // Normalizar el texto: quitar acentos y diacríticos (ej: mañana -> manana, übermorgen -> ubermorgen)
  const cleanText = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
    
  const dates = new Set();

  // Helper para dar formato local AAAA-MM-DD
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1. Fechas relativas inmediatas (claves de mayor longitud primero para evitar colisiones)
  // Ej: 'pasado manana' antes de 'manana'
  const relativesTwoDays = {
    'pasado manana': 2, 'day after tomorrow': 2, 'uebermorgen': 2, 'ubermorgen': 2, 'dema passat': 2
  };
  const relativesOneDay = {
    'manana': 1, 'tomorrow': 1, 'morgen': 1, 'dema': 1
  };
  const relativesToday = {
    'hoy': 0, 'today': 0, 'heute': 0, 'avui': 0
  };

  let workingText = cleanText;

  // Procesar T+2
  for (const [key, offset] of Object.entries(relativesTwoDays)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(workingText)) {
      const d = new Date(referenceDate);
      d.setDate(d.getDate() + offset);
      dates.add(formatDate(d));
      // Reemplazar para evitar que 'manana' o 'dema' coincidan con la subcadena
      workingText = workingText.replace(regex, '__processed__');
    }
  }

  // Procesar T+1
  for (const [key, offset] of Object.entries(relativesOneDay)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(workingText)) {
      const d = new Date(referenceDate);
      d.setDate(d.getDate() + offset);
      dates.add(formatDate(d));
      workingText = workingText.replace(regex, '__processed__');
    }
  }

  // Procesar T+0
  for (const [key, offset] of Object.entries(relativesToday)) {
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(workingText)) {
      const d = new Date(referenceDate);
      d.setDate(d.getDate() + offset);
      dates.add(formatDate(d));
    }
  }

  // 2. Expresiones numéricas de formato estándar: DD/MM/AAAA, DD-MM-AAAA
  const standardRegex = /\b(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})\b/g;
  let match;
  while ((match = standardRegex.exec(text)) !== null) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      dates.add(formatDate(d));
    }
  }

  // Formato ISO: AAAA-MM-DD
  const isoRegex = /\b(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})\b/g;
  while ((match = isoRegex.exec(text)) !== null) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      dates.add(formatDate(d));
    }
  }

  // 3. Expresiones de nombres verbales de meses (normalizados a ASCII)
  const monthsMap = {
    enero: 0, gener: 0, january: 0, januar: 0,
    febrero: 1, febrer: 1, february: 1, februar: 1,
    marzo: 2, marc: 2, march: 2, marz: 2,
    abril: 3, april: 3,
    mayo: 4, maig: 4, may: 4, mai: 4,
    junio: 5, juny: 5, june: 5, juni: 5,
    julio: 6, juliol: 6, july: 6, juli: 6,
    agosto: 7, agost: 7, august: 7,
    septiembre: 8, setembre: 8, september: 8,
    octubre: 9, october: 9, oktober: 9,
    noviembre: 10, novembre: 10, november: 10,
    diciembre: 11, desembre: 11, december: 11, dezember: 11
  };

  for (const [monthName, monthIndex] of Object.entries(monthsMap)) {
    // Formato: (día) de/of/. (mes)
    const monthRegex = new RegExp(`\\b(\\d{1,2})(?:\\s*(?:de|of|\\.)\\s*|\\s+)\\b${monthName}\\b`, 'i');
    const matchMonth = cleanText.match(monthRegex);
    if (matchMonth) {
      const day = parseInt(matchMonth[1], 10);
      const year = referenceDate.getFullYear();
      const d = new Date(year, monthIndex, day);
      if (!isNaN(d.getTime())) {
        dates.add(formatDate(d));
      }
    }
    
    // Formato: (mes) (día)
    const reverseMonthRegex = new RegExp(`\\b${monthName}\\b(?:\\s+(?:the\\s+)?|\\s*)(\\d{1,2})\\b`, 'i');
    const matchRevMonth = cleanText.match(reverseMonthRegex);
    if (matchRevMonth) {
      const day = parseInt(matchRevMonth[1], 10);
      const year = referenceDate.getFullYear();
      const d = new Date(year, monthIndex, day);
      if (!isNaN(d.getTime())) {
        dates.add(formatDate(d));
      }
    }
  }

  // 4. Mapeo de días de la semana (normalizados a ASCII)
  const daysOfWeekMap = {
    domingo: 0, diumenge: 0, sunday: 0, sonntag: 0,
    lunes: 1, dilluns: 1, monday: 1, montag: 1,
    martes: 2, dimarts: 2, tuesday: 2, dienstag: 2,
    miercoles: 3, dimecres: 3, wednesday: 3, mittwoch: 3,
    jueves: 4, dijous: 4, thursday: 4, donnerstag: 4,
    viernes: 5, divendres: 5, friday: 5, freitag: 5,
    sabado: 6, dissabte: 6, saturday: 6, samstag: 6
  };

  for (const [dayName, dayIndex] of Object.entries(daysOfWeekMap)) {
    const dayRegex = new RegExp(`\\b${dayName}\\b`, 'i');
    if (dayRegex.test(cleanText)) {
      const d = new Date(referenceDate);
      const currentDay = d.getDay();
      let diff = dayIndex - currentDay;
      if (diff <= 0) {
        diff += 7; // Próxima semana
      }
      d.setDate(d.getDate() + diff);
      dates.add(formatDate(d));
    }
  }

  return Array.from(dates).sort();
}

module.exports = {
  extractDates
};
