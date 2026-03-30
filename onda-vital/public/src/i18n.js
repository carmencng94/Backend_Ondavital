// i18n.js
// Propósito: Gestionar el idioma de la aplicación en el frontend, las traducciones estáticas y dinámicas.

export const SUPPORTED_LANGUAGES = ['es', 'en', 'de', 'ca'];
export const DEFAULT_LANGUAGE = 'es';

// Traducciones de textos estáticos (no DB)
const staticTranslations = {
  es: {
    // --- NAV ---
    nav_home: 'Inicio',
    nav_salas: 'Salas',
    nav_quiro: 'Quiropráctica',
    nav_reso: 'Resosense',
    nav_contacto: 'Contacto',
    nav_admin: 'Panel Admin',
    // --- CHAT ---
    chat_button: '✦ Asistente Vitalis',
    chat_header: 'Asistente Vitalis',
    chat_status: 'En línea',
    chat_input_placeholder: 'Escribe tu mensaje aquí...',
    chat_send: 'Enviar',
    chat_error: 'Lo siento, hubo un error de conexión.',
    chat_help_line1: '¿Necesitas ayuda?',
    chat_help_line2: 'Estoy aquí para ti.',
    // --- CHAT MODAL ---
    modal_title: '¡Tu sala está lista para confirmar!',
    modal_desc: 'David cerrará tu reserva por WhatsApp.',
    modal_name: 'Nombre:',
    modal_contact: 'Contacto:',
    modal_room: 'Sala/Servicio:',
    modal_date: 'Fecha:',
    modal_time: 'Horario:',
    modal_confirm_wa: 'Confirmar en WhatsApp',
    modal_edit: 'Editar',
    // --- HOME ---
    home_hero_main: 'Espacios para Crecer',
    home_hero_sub: 'Tu evento o terapia en el mejor entorno de Onda Vital',
    home_glass_1: 'Alquiler de salas equipadas y gestionadas para tu éxito.',
    home_glass_2: 'Encuentra el lugar perfecto para tu propósito.',
    home_ai_title: 'Reserva Directa con IA',
    home_ai_desc: 'Indica qué sala necesitas y cuándo, yo me encargo del resto.',
    home_ai_placeholder: 'Ej: Quiero reservar la Sala Jardín para el lunes...',
    home_ai_btn: 'Consultar',
    home_cta_title_alt: 'Un Espacio para Cada Necesidad',
    home_cta_desc_alt: 'Además de nuestras salas, colaboramos con profesionales externos para ofrecerte un bienestar integral.',
    home_cta_deawakening: '✦ Visita Deawakening - Nuestra plataforma aliada',
    // --- CONTACTO ---
    contacto_title: 'Contáctanos',
    contacto_quiro_label: 'Quiropráctica',
    contacto_salas_label: 'Alquiler de Salas',
    contacto_wa_label: 'WhatsApp:',
    contacto_atencion: 'Atención: David',
    contacto_dir_label: 'Dirección',
    contacto_form_nombre: 'Nombre *',
    contacto_form_nombre_ph: 'Tu nombre',
    contacto_form_email: 'Email *',
    contacto_form_email_ph: 'tu@email.com',
    contacto_form_msg: 'Mensaje',
    contacto_form_msg_ph: '¿En qué podemos ayudarte?',
    contacto_form_submit: 'Enviar',
    contacto_form_ok: 'Mensaje enviado. ¡Gracias!',
    // --- FOOTER ---
    footer_quiro_title: 'Quiropráctica',
    footer_schedule_title: 'Horario de información:',
    footer_location: 'Nuestra Ubicación',
    footer_contact: 'Contacto',
    footer_phone_label: 'Teléfono:',
    footer_wa_label: 'WhatsApp:',
    footer_form_title: 'Solicite información',
    footer_form_nombre: 'Nombre',
    footer_form_nombre_ph: 'Escriba su nombre',
    footer_form_email: 'Email*',
    footer_form_email_ph: 'Escriba su email',
    footer_form_asunto: 'Asunto*',
    footer_form_asunto_ph: 'Ingresa tu mensaje',
    footer_form_submit: 'Enviar',
    // --- QUIRO ---
    quiro_visit_dea: 'Visitar la web oficial de DEAwakening ↗',
    // --- SALAS ---
    salas_loading: 'Cargando salas...',
    salas_error: 'Error al cargar el catálogo.',
    salas_more: 'Más detalles +',
    salas_availability: 'Ver Disponibilidad',
    salas_equip_title: 'Equipamiento y Servicios',
    salas_rates_title: 'Estructura de Tarifas',
    salas_rate_hour: 'Hora',
    salas_rate_day: 'Día',
    salas_no_desc: 'Sin descripción disponible.',
    salas_title: 'Alquiler de Salas',
    salas_subtitle: '¿Buscas un espacio para presentar tu próximo taller o un despacho para reunirte con tus clientes? En Onda Vital tenemos lo que estás buscando.',
    // --- BOOKING GRID ---
    booking_step1: '¿Qué día quieres venir?',
    booking_step2: 'Escoge Sala y Horas',
    booking_step3: 'Tus Datos de Contacto',
    booking_busy_today: 'Ocupado hoy:',
    booking_next: 'Siguiente',
    booking_back: 'Atrás',
    booking_confirm: 'Confirmar Pre-Reserva',
    booking_name_ph: 'Tu nombre completo',
    booking_contact_ph: 'Email o Teléfono',
    booking_form_note: 'Al confirmar, se guardará tu pre-reserva y abriremos WhatsApp.',
    booking_alert_missing: 'Por favor, indica tu nombre y contacto.',
    chat_consult_room: 'Quiero consultar disponibilidad para la',
    wa_message: 'Hola David, soy {nombre}. Quiero confirmar mi reserva de {sala} para el {fecha} a las {horario}. Mi contacto es {contacto}.',
  },
  en: {
    // --- NAV ---
    nav_home: 'Home',
    nav_salas: 'Rooms',
    nav_quiro: 'Chiropractic',
    nav_reso: 'Resosense',
    nav_contacto: 'Contact',
    nav_admin: 'Admin Panel',
    // --- CHAT ---
    chat_button: '✦ Vitalis Assistant',
    chat_header: 'Vitalis Assistant',
    chat_status: 'Online',
    chat_input_placeholder: 'Type your message here...',
    chat_send: 'Send',
    chat_error: 'Sorry, there was a connection error.',
    chat_help_line1: 'Need help?',
    chat_help_line2: "I'm here for you.",
    // --- CHAT MODAL ---
    modal_title: 'Your room is ready to confirm!',
    modal_desc: 'David will finalise your booking via WhatsApp.',
    modal_name: 'Name:',
    modal_contact: 'Contact:',
    modal_room: 'Room/Service:',
    modal_date: 'Date:',
    modal_time: 'Time:',
    modal_confirm_wa: 'Confirm on WhatsApp',
    modal_edit: 'Edit',
    // --- HOME ---
    home_hero_main: 'Spaces to Grow',
    home_hero_sub: 'Your event or therapy in the best Onda Vital setting',
    home_glass_1: 'Equipped and managed room rental for your success.',
    home_glass_2: 'Find the perfect place for your purpose.',
    home_ai_title: 'Direct AI Booking',
    home_ai_desc: 'Tell me which room you need and when — I\'ll handle the rest.',
    home_ai_placeholder: 'E.g.: I want to book the Garden Room for Monday...',
    home_ai_btn: 'Search',
    home_cta_title_alt: 'A Space for Every Need',
    home_cta_desc_alt: 'In addition to our rooms, we collaborate with external professionals to offer you holistic well-being.',
    home_cta_deawakening: '✦ Visit Deawakening – Our partner platform',
    // --- CONTACTO ---
    contacto_title: 'Contact Us',
    contacto_quiro_label: 'Chiropractic',
    contacto_salas_label: 'Room Rental',
    contacto_wa_label: 'WhatsApp:',
    contacto_atencion: 'Attention: David',
    contacto_dir_label: 'Address',
    contacto_form_nombre: 'Name *',
    contacto_form_nombre_ph: 'Your name',
    contacto_form_email: 'Email *',
    contacto_form_email_ph: 'you@email.com',
    contacto_form_msg: 'Message',
    contacto_form_msg_ph: 'How can we help you?',
    contacto_form_submit: 'Send',
    contacto_form_ok: 'Message sent. Thank you!',
    // --- FOOTER ---
    footer_quiro_title: 'Chiropractic',
    footer_schedule_title: 'Opening hours:',
    footer_location: 'Our Location',
    footer_contact: 'Contact',
    footer_phone_label: 'Phone:',
    footer_wa_label: 'WhatsApp:',
    footer_form_title: 'Request Information',
    footer_form_nombre: 'Name',
    footer_form_nombre_ph: 'Enter your name',
    footer_form_email: 'Email*',
    footer_form_email_ph: 'Enter your email',
    footer_form_asunto: 'Subject*',
    footer_form_asunto_ph: 'Enter your message',
    footer_form_submit: 'Send',
    // --- QUIRO ---
    quiro_visit_dea: 'Visit the official DEAwakening website ↗',
    // --- SALAS ---
    salas_loading: 'Loading rooms...',
    salas_error: 'Error loading the catalogue.',
    salas_more: 'More details +',
    salas_availability: 'Check Availability',
    salas_equip_title: 'Equipment & Services',
    salas_rates_title: 'Rate Structure',
    salas_rate_hour: 'Hour',
    salas_rate_day: 'Day',
    salas_no_desc: 'No description available.',
    salas_title: 'Room Rental',
    salas_subtitle: 'Looking for a space for your next workshop or an office to meet your clients? At Onda Vital we have what you are looking for.',
    // --- BOOKING GRID ---
    booking_step1: 'What day would you like to come?',
    booking_step2: 'Choose Room and Hours',
    booking_step3: 'Your Contact Details',
    booking_busy_today: 'Busy today:',
    booking_next: 'Next',
    booking_back: 'Back',
    booking_confirm: 'Confirm Pre-Booking',
    booking_name_ph: 'Your full name',
    booking_contact_ph: 'Email or Phone',
    booking_form_note: 'When you confirm, your pre-booking will be saved and WhatsApp will open.',
    booking_alert_missing: 'Please enter your name and contact.',
    chat_consult_room: 'I would like to check availability for',
    wa_message: 'Hello David, I am {nombre}. I want to confirm my booking for {sala} on {fecha} at {horario}. My contact is {contacto}.',
  },
  de: {
    // --- NAV ---
    nav_home: 'Startseite',
    nav_salas: 'Räume',
    nav_quiro: 'Chiropraktik',
    nav_reso: 'Resosense',
    nav_contacto: 'Kontakt',
    nav_admin: 'Admin-Bereich',
    // --- CHAT ---
    chat_button: '✦ Vitalis Assistent',
    chat_header: 'Vitalis Assistent',
    chat_status: 'Online',
    chat_input_placeholder: 'Schreiben Sie hier Ihre Nachricht...',
    chat_send: 'Senden',
    chat_error: 'Es gab einen Verbindungsfehler.',
    chat_help_line1: 'Brauchen Sie Hilfe?',
    chat_help_line2: 'Ich bin hier für Sie.',
    // --- CHAT MODAL ---
    modal_title: 'Ihr Raum ist bereit zur Bestätigung!',
    modal_desc: 'David wird Ihre Buchung per WhatsApp abschließen.',
    modal_name: 'Name:',
    modal_contact: 'Kontakt:',
    modal_room: 'Raum/Dienst:',
    modal_date: 'Datum:',
    modal_time: 'Uhrzeit:',
    modal_confirm_wa: 'Auf WhatsApp bestätigen',
    modal_edit: 'Bearbeiten',
    // --- HOME ---
    home_hero_main: 'Räume zum Wachsen',
    home_hero_sub: 'Ihre Veranstaltung oder Therapie im besten Ambiente von Onda Vital',
    home_glass_1: 'Ausgestattete und verwaltete Raumvermietung für Ihren Erfolg.',
    home_glass_2: 'Finden Sie den perfekten Ort für Ihr Vorhaben.',
    home_ai_title: 'Direkte KI-Buchung',
    home_ai_desc: 'Sagen Sie mir, welchen Raum Sie brauchen und wann — ich erledige den Rest.',
    home_ai_placeholder: 'z.B.: Ich möchte den Gartensaal für Montag buchen...',
    home_ai_btn: 'Suchen',
    home_cta_title_alt: 'Ein Raum für jedes Bedürfnis',
    home_cta_desc_alt: 'Neben unseren Räumen arbeiten wir mit externen Fachleuten zusammen, um Ihnen ganzheitliches Wohlbefinden zu bieten.',
    home_cta_deawakening: '✦ Besuchen Sie Deawakening – Unsere Partnerplattform',
    // --- CONTACTO ---
    contacto_title: 'Kontaktieren Sie uns',
    contacto_quiro_label: 'Chiropraktik',
    contacto_salas_label: 'Raumvermietung',
    contacto_wa_label: 'WhatsApp:',
    contacto_atencion: 'Ansprechpartner: David',
    contacto_dir_label: 'Adresse',
    contacto_form_nombre: 'Name *',
    contacto_form_nombre_ph: 'Ihr Name',
    contacto_form_email: 'E-Mail *',
    contacto_form_email_ph: 'ihre@email.com',
    contacto_form_msg: 'Nachricht',
    contacto_form_msg_ph: 'Wie können wir Ihnen helfen?',
    contacto_form_submit: 'Senden',
    contacto_form_ok: 'Nachricht gesendet. Vielen Dank!',
    // --- FOOTER ---
    footer_quiro_title: 'Chiropraktik',
    footer_schedule_title: 'Öffnungszeiten:',
    footer_location: 'Unser Standort',
    footer_contact: 'Kontakt',
    footer_phone_label: 'Telefon:',
    footer_wa_label: 'WhatsApp:',
    footer_form_title: 'Informationen anfordern',
    footer_form_nombre: 'Name',
    footer_form_nombre_ph: 'Geben Sie Ihren Namen ein',
    footer_form_email: 'E-Mail*',
    footer_form_email_ph: 'Geben Sie Ihre E-Mail ein',
    footer_form_asunto: 'Betreff*',
    footer_form_asunto_ph: 'Geben Sie Ihre Nachricht ein',
    footer_form_submit: 'Senden',
    // --- QUIRO ---
    quiro_visit_dea: 'Offizielle DEAwakening-Website besuchen ↗',
    // --- SALAS ---
    salas_loading: 'Räume werden geladen...',
    salas_error: 'Fehler beim Laden des Katalogs.',
    salas_more: 'Mehr Details +',
    salas_availability: 'Verfügbarkeit prüfen',
    salas_equip_title: 'Ausstattung & Dienste',
    salas_rates_title: 'Tarifübersicht',
    salas_rate_hour: 'Stunde',
    salas_rate_day: 'Tag',
    salas_no_desc: 'Keine Beschreibung verfügbar.',
    salas_title: 'Raummiete',
    salas_subtitle: 'Suchen Sie einen Raum für Ihren nächsten Workshop oder ein Büro, um Ihre Kunden zu treffen? Bei Onda Vital haben wir das, wonach Sie suchen.',
    // --- BOOKING GRID ---
    booking_step1: 'An welchem Tag möchten Sie kommen?',
    booking_step2: 'Raum und Uhrzeiten wählen',
    booking_step3: 'Ihre Kontaktdaten',
    booking_busy_today: 'Heute belegt:',
    booking_next: 'Weiter',
    booking_back: 'Zurück',
    booking_confirm: 'Vorbuchung bestätigen',
    booking_name_ph: 'Ihr vollständiger Name',
    booking_contact_ph: 'E-Mail oder Telefon',
    booking_form_note: 'Nach Bestätigung wird Ihre Vorbuchung gespeichert und WhatsApp geöffnet.',
    booking_alert_missing: 'Bitte geben Sie Ihren Namen und Kontakt ein.',
    chat_consult_room: 'Ich möchte die Verfügbarkeit prüfen für',
    wa_message: 'Hallo David, ich bin {nombre}. Ich möchte meine Reservierung für {sala} am {fecha} um {horario} bestätigen. Mein Kontakt ist {contacto}.',
  },
  ca: {
    // --- NAV ---
    nav_home: 'Inici',
    nav_salas: 'Sales',
    nav_quiro: 'Quiropràctica',
    nav_reso: 'Resosense',
    nav_contacto: 'Contacte',
    nav_admin: 'Panell Admin',
    // --- CHAT ---
    chat_button: '✦ Assistent Vitalis',
    chat_header: 'Assistent Vitalis',
    chat_status: 'En línia',
    chat_input_placeholder: 'Escriu el teu missatge aquí...',
    chat_send: 'Enviar',
    chat_error: 'Ho sentim, hi ha hagut un error de connexió.',
    chat_help_line1: 'Necessites ajuda?',
    chat_help_line2: 'Sóc aquí per a tu.',
    // --- CHAT MODAL ---
    modal_title: 'La teva sala està llesta per confirmar!',
    modal_desc: 'En David tancarà la teva reserva per WhatsApp.',
    modal_name: 'Nom:',
    modal_contact: 'Contacte:',
    modal_room: 'Sala/Servei:',
    modal_date: 'Data:',
    modal_time: 'Horari:',
    modal_confirm_wa: 'Confirmar a WhatsApp',
    modal_edit: 'Editar',
    // --- HOME ---
    home_hero_main: 'Espais per Créixer',
    home_hero_sub: 'El teu event o teràpia en el millor entorn d\'Onda Vital',
    home_glass_1: 'Lloguer de sales equipades i gestionades per al teu èxit.',
    home_glass_2: 'Troba el lloc perfecte per al teu propòsit.',
    home_ai_title: 'Reserva Directa amb IA',
    home_ai_desc: 'Indica quina sala necessites i quan, jo m\'encarrego de la resta.',
    home_ai_placeholder: 'Ex: Vull reservar la Sala Jardí per dilluns...',
    home_ai_btn: 'Consultar',
    home_cta_title_alt: 'Un Espai per a Cada Necessitat',
    home_cta_desc_alt: 'A més de les nostres sales, col·laborem amb professionals externs per oferir-te un benestar integral.',
    home_cta_deawakening: '✦ Visita Deawakening – La nostra plataforma aliada',
    // --- CONTACTO ---
    contacto_title: 'Contacta\'ns',
    contacto_quiro_label: 'Quiropràctica',
    contacto_salas_label: 'Lloguer de Sales',
    contacto_wa_label: 'WhatsApp:',
    contacto_atencion: 'Atenció: David',
    contacto_dir_label: 'Adreça',
    contacto_form_nombre: 'Nom *',
    contacto_form_nombre_ph: 'El teu nom',
    contacto_form_email: 'Email *',
    contacto_form_email_ph: 'tu@email.com',
    contacto_form_msg: 'Missatge',
    contacto_form_msg_ph: 'En què podem ajudar-te?',
    contacto_form_submit: 'Enviar',
    contacto_form_ok: 'Missatge enviat. Gràcies!',
    // --- FOOTER ---
    footer_quiro_title: 'Quiropràctica',
    footer_schedule_title: 'Horari d\'informació:',
    footer_location: 'La nostra Ubicació',
    footer_contact: 'Contacte',
    footer_phone_label: 'Telèfon:',
    footer_wa_label: 'WhatsApp:',
    footer_form_title: 'Sol·licita informació',
    footer_form_nombre: 'Nom',
    footer_form_nombre_ph: 'Escriu el teu nom',
    footer_form_email: 'Email*',
    footer_form_email_ph: 'Escriu el teu email',
    footer_form_asunto: 'Assumpte*',
    footer_form_asunto_ph: 'Escriu el teu missatge',
    footer_form_submit: 'Enviar',
    // --- QUIRO ---
    quiro_visit_dea: 'Visita el web oficial de DEAwakening ↗',
    // --- SALAS ---
    salas_loading: 'Carregant sales...',
    salas_error: 'Error en carregar el catàleg.',
    salas_more: 'Més detalls +',
    salas_availability: 'Veure Disponibilitat',
    salas_equip_title: 'Equipament i Serveis',
    salas_rates_title: 'Estructura de Tarifes',
    salas_rate_hour: 'Hora',
    salas_rate_day: 'Dia',
    salas_no_desc: 'Sense descripció disponible.',
    salas_title: 'Lloguer de Sales',
    salas_subtitle: 'Busques un espai per presentar el teu proper taller o un despatx per reunir-te amb els teus clients? A Onda Vital tenim el que estàs buscant.',
    // --- BOOKING GRID ---
    booking_step1: 'Quin dia vols venir?',
    booking_step2: 'Tria Sala i Hores',
    booking_step3: 'Les teves Dades de Contacte',
    booking_busy_today: 'Ocupat avui:',
    booking_next: 'Següent',
    booking_back: 'Enrere',
    booking_confirm: 'Confirmar Pre-Reserva',
    booking_name_ph: 'El teu nom complet',
    booking_contact_ph: 'Email o Telèfon',
    booking_form_note: 'En confirmar, es guardarà la teva pre-reserva i obrirem WhatsApp.',
    booking_alert_missing: 'Si us plau, indica el teu nom i contacte.',
    chat_consult_room: 'Vull consultar la disponibilitat de',
    wa_message: 'Hola David, sóc {nombre}. Vull confirmar la meva reserva de {sala} per al {fecha} a les {horario}. El meu contacte és {contacto}.',
  }
};

class I18nManager {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.siteContent = {}; // Contenido dinámico desde la DB
    document.documentElement.lang = this.currentLanguage;
  }

  detectLanguage() {
    const storedQuery = new URLSearchParams(window.location.search).get('lang');
    if (storedQuery && SUPPORTED_LANGUAGES.includes(storedQuery)) {
      localStorage.setItem('lang', storedQuery);
      return storedQuery;
    }

    const storedLang = localStorage.getItem('lang');
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      return storedLang;
    }

    const browserLang = navigator.language.split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }

    return DEFAULT_LANGUAGE;
  }

  setLanguage(lang) {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      localStorage.setItem('lang', lang);
      this.currentLanguage = lang;
      document.documentElement.lang = lang;
      // Recargar la página para aplicar los cambios fácilmente en toda la UI
      window.location.reload(); 
    }
  }

  setSiteContent(content) {
    // content es { es: {...}, en: {...}, de: {...}, ca: {...} }
    this.siteContent = content;

    // Proveer retrocompatibilidad global inyectando solo el idioma actual
    window.siteContent = this.siteContent[this.currentLanguage] || this.siteContent[DEFAULT_LANGUAGE] || {};
  }

  t(key) {
    // 1. Buscar en el contenido dinámico (DB)
    if (this.siteContent[this.currentLanguage] && this.siteContent[this.currentLanguage][key]) {
      return this.siteContent[this.currentLanguage][key];
    }
    // Fallback a español (DB)
    if (this.siteContent[DEFAULT_LANGUAGE] && this.siteContent[DEFAULT_LANGUAGE][key]) {
      return this.siteContent[DEFAULT_LANGUAGE][key];
    }

    // 2. Buscar en contenido estático local
    if (staticTranslations[this.currentLanguage] && staticTranslations[this.currentLanguage][key]) {
      return staticTranslations[this.currentLanguage][key];
    }
    // Fallback estático a español
    if (staticTranslations[DEFAULT_LANGUAGE] && staticTranslations[DEFAULT_LANGUAGE][key]) {
      return staticTranslations[DEFAULT_LANGUAGE][key];
    }

    // Si todo falla, devolver la clave como pista visual
    return key;
  }
}

export const i18n = new I18nManager();
