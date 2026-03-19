// Model: ContentModel.js
// Propósito: Almacenar y gestionar los bloques de contenido de la web utilizando SQLite.

const Database = require('better-sqlite3');
const path = require('path');

// Obtener la ruta de la DB desde var de entorno o usar fallback
const dbPath = process.env.DB_PATH || './memory.db';
const db = new Database(dbPath);

// Inicializar tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS content_blocks (
    id TEXT PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    type TEXT,
    updated_at TEXT
  )
`);

// Insertar contenido de prueba inicial o sincronizar nuevos campos
try {
  console.log("Sincronizando textos predeterminados en 'content_blocks'...");
  const insertStmt = db.prepare('INSERT OR IGNORE INTO content_blocks (key, value, type, updated_at) VALUES (?, ?, ?, ?)');
    
    const defaults = {
      // --- HOME ---
      'home_hero_title': 'Nuestro Enfoque Eres Tú',
      'home_hero_subtitle': 'Vuelve a conectar con tu vitalidad natural',
      'home_glass_p1': 'Tu cuerpo tiene una capacidad innata de mantenerse sano',
      'home_glass_p2': 'Estamos aquí para ayudarte a recuperarla.',
      'home_intro_title': 'Entendiendo el Desequilibrio',
      'home_intro_desc': 'La vida diaria está llena de fuentes de estrés que interfieren con tu bienestar:',
      'home_stress_1': 'Estrés Físico (posturas, lesiones)',
      'home_stress_2': 'Estrés Mental (bloqueos, preocupaciones)',
      'home_stress_3': 'Estrés Emocional (tensiones acumuladas)',
      'home_stress_conc': 'Estas interferencias resultan en dolor, disfunción y malestar.',
      'home_cta_title': 'Restaura tu habilidad de sanar',
      'home_cta_desc': 'En Onda Vital trabajamos para que puedas disfrutar de una vida plena y libre de limitaciones.',
      'home_cta_tagline': 'Mereces disfrutar de tu vida',

      // --- CONTACTO ---
      'contacto_telefono': '601 39 21 61',
      'contacto_email': 'info@ondavitalholistic.com',
      'contacto_direccion': 'c/ Martí Boneo, 31 bajos, 07013 Palma de Mallorca (Son Dameto)',
      'contacto_horarios_q1': 'Lunes y Miércoles: 17:30 - 20h',
      'contacto_horarios_q2': 'Martes y Jueves: 10:30 - 13h',

      // --- QUIROPRÁCTICA ---
      'quiro_title': 'Quiropráctica',
      'quiro_subtitle': '¡No hay que estar mal para estar mejor!',
      'quiro_intro_1': 'La Quiropráctica es una profesión sanitaria reconocida en la mayoría de países desarrollados del mundo. Se trata de mejorar la capacidad del cuerpo de curarse y mantenerse sano.',
      'quiro_intro_2': 'La gente acude al quiropráctico por muchas razones, entre ellas, para:',
      'quiro_benefits_li1': 'Aliviar el dolor, nerviosismo y síntomas de estrés',
      'quiro_benefits_li2': 'Mejorar el sueño, digestión o movilidad',
      'quiro_benefits_li3': 'Sentirse bien y disfrutar más de la vida',
      'quiro_integral_desc': 'La Quiropráctica Integral que utilizamos en Onda Vital se basa en un conjunto de métodos. Combina técnicas físicas/energéticas con la enseñanza de prácticas personales que empoderan al cliente a tomar un papel más activo en su propia mejora.',
      'quiro_dea_title': 'DEA - Deep Energetic Awakening',
      'quiro_dea_desc': 'Basada en Network Spinal Analysis, es una técnica avanzada y a la vez muy suave. Ayuda a que el cuerpo aprenda a reconocer y corregir patrones de tensión y distorsión que impiden su buen funcionamiento.',
      'quiro_dea_extra': '¡Asiste a tu cuerpo a recuperar su estado natural de salud para disfrutar de la vida con menos dolor, menos estrés y más flexibilidad y energía!',
      'quiro_resosense_desc': 'Práctica personal desarrollada por David Biddle aquí en Mallorca. Utiliza la resonancia estructural del cuerpo para equilibrar y mejorar tu ser.',
      'quiro_resosense_extra': 'Con solo unos minutos al día, tumbado, usando los suaves movimientos, se generan cambios sorprendentes. Es el complemento perfecto al DEA.',
      'quiro_eval_desc': 'Para empezar con nosotros, hacemos una evaluación inicial en dos visitas. Así podemos entender bien tanto los problemas como las metas de cada cliente para maximizar el éxito de su tratamiento.',
      'quiro_cta_title': '¿Listo para empezar tu camino al bienestar?',
      'quiro_cta_subtitle': 'Llámanos para concertar una cita de evaluación',

      // --- RESOSENSE ---
      'reso_title': 'Resosense',
      'reso_subtitle': 'Una suave práctica de movimiento personal para un cambio profundo.',
      'reso_question': '¿Qué es Resosense?',
      'reso_answer_1': 'Resosense es una práctica personal en la que utilizas tus propios músculos para generar ondas de resonancia en tu cuerpo.',
      'reso_highlight': 'El movimiento suave en frecuencias específicas es simple y sus efectos se pueden ver en todos los sistemas del cuerpo, tanto físicos como energéticos.',
      'reso_origen_title': 'Nuestros Orígenes',
      'reso_origen_desc': 'A partir de 2006, David reconoció por primera vez la existencia de frecuencias específicas de movimiento ondulatorio u oscilación en el cuerpo.',
      'reso_origen_extra': 'Tras un momento de epifanía, se dio cuenta de que lo que había encontrado era en realidad la frecuencia fundamental del cuerpo humano. Utilizando ese conocimiento, desarrolló el sistema que hoy es Resosense.',
      'reso_benefits_title': '¿Por qué practicar Resosense?',
      'reso_feature1_title': 'Estado Natural',
      'reso_feature1_desc': 'La práctica regular de Resosense te restaura a ti y a tu cuerpo a un estado más cercano a su condición original pura.',
      'reso_feature2_title': 'Liberación de Impactos',
      'reso_feature2_desc': 'Ayuda a liberar la huella de los eventos de la vida que han impactado tu ser antes de que tengan la oportunidad de dejar una marca permanente.',
      'reso_training_title': 'Formación y Talleres',
      'reso_training_desc': 'La práctica de Resosense se enseña en un curso de dos módulos (Básico y Avanzado) utilizando diversas modalidades de aprendizaje.',
      'reso_training_mod1': 'Módulo Básico',
      'reso_training_mod2': 'Módulo Avanzado',
      'reso_training_format': 'El formato suele ser de dos días durante un fin de semana, pero puede adaptarse a diferentes programas y lugares.',
      'reso_training_prof': 'También existen formaciones profesionales para terapeutas interesados en compartir Resosense con sus clientes.',
      'reso_banner_text': 'Descubre la frecuencia fundamental de tu bienestar.',

      // --- SOBRE NOSOTROS (ABOUT) ---
      'about_title': 'Mereces disfrutar de tu vida',
      'about_desc': 'Venir a Onda Vital es regalarte un tiempo para ti. Un espacio para sentir y tomar la mejor decisión para tu salud y tu vida.',
      'about_quiro_title': 'Horario de Quiropráctica',
      'about_salas_title': 'Contacto Salas',
      'about_salas_coordinator': 'David - Coordinador de Espacios',

      // --- SERVICIOS ---
      'services_title': 'Nuestros Servicios Holísticos',
      'services_nsa_title': 'Quiropráctica Integral (NSA)',
      'services_nsa_desc': 'El Network Spinal Analysis es una técnica suave que ayuda al sistema nervioso a liberar tensiones y reorganizarse.',
      'services_reso_title': 'Resosense Formación',
      'services_reso_desc': 'Método único que combina respiración, sonido y conciencia corporal para elevar tu vitalidad.',
      'services_talleres_title': 'Talleres y Clases Grupales',
      'services_talleres_desc': 'Disponemos de clases de Yoga, Meditación y diversos talleres de crecimiento personal.',

      // --- SALAS (HEADER) ---
      'salas_header_title': 'Salas Polivalentes',
      'salas_header_subtitle': 'Un oasis en plena ciudad para clases, talleres o terapias.',

      // --- SALAS (CABECERA) ---
      'salas_header_title': 'Salas Polivalentes',
      'salas_header_subtitle': 'Un oasis en plena ciudad para clases, talleres o terapias.',

      // --- SALA JARDIN ---
      'sala_jardin_nombre': 'Sala Jardín',
      'sala_jardin_dimensiones': '8.5×4.5 m (32 m²)',
      'sala_jardin_capacidad': '10 esterillas / 25 sentados',
      'sala_jardin_desc': 'Un espacio amplio y luminoso que conecta directamente con nuestro jardín exterior. Ideal para clases de yoga, meditación, talleres grupales o conferencias pequeñas. Su suelo de madera y la luz natural crean una atmósfera de paz inigualable.',
      'sala_jardin_tarifa_hora': '20€/h',
      'sala_jardin_tarifa_dia': '120€/día',
      'sala_jardin_tarifa_bono': '150€ (10h)',
      'sala_jardin_tarifa_mensual': 'Desde 40€/h',
      'sala_jardin_equipo': 'Proyector HD, Sistema de Sonido Bluetooth, 15 Esterillas, 25 Sillas, Luz Natural, Acceso a Jardín',

      // --- SALA AZUL ---
      'sala_azul_nombre': 'Sala Azul',
      'sala_azul_dimensiones': '6.5×5 m (32 m²)',
      'sala_azul_capacidad': '10 camillas / 30 sentados',
      'sala_azul_desc': 'Nuestra Sala Azul ofrece un entorno profesional y acogedor. Con vistas al jardín y una moqueta de alta calidad, es perfecta para formaciones que requieran camillas o para charlas dinámicas.',
      'sala_azul_tarifa_hora': '20€/h',
      'sala_azul_tarifa_dia': '120€/día',
      'sala_azul_tarifa_bono': '150€ (10h)',
      'sala_azul_tarifa_mensual': 'Desde 40€/h',
      'sala_azul_equipo': 'Aire Acondicionado, Moqueta Premium, Proyector/Sonido, Vistas al Jardín, 8 Camillas disponibles',

      // --- DESPACHO PLUS ---
      'sala_despacho_plus_nombre': 'Despacho+',
      'sala_despacho_plus_dimensiones': '4.1×3.2 m (13 m²)',
      'sala_despacho_plus_capacidad': '8 personas',
      'sala_despacho_plus_desc': 'El Despacho+ es la joya de la corona para terapeutas que buscan privacidad y exclusividad. Un espacio íntimo, con aire acondicionado y vistas relajantes, diseñado para sesiones de psicología, nutrición o masajes.',
      'sala_despacho_plus_tarifa_hora': '16€/h',
      'sala_despacho_plus_tarifa_dia': '90€/día',
      'sala_despacho_plus_tarifa_bono': '140€ (10h)',
      'sala_despacho_plus_tarifa_mensual': 'Desde 35€/h',
      'sala_despacho_plus_equipo': 'Privacidad Total, Aire Acondicionado, Mesa de Reunión, 2 Sillones Premium, Camilla disponible',

      // --- SALA TERAPIA A ---
      'sala_terapia_a_nombre': 'Sala Terapia A',
      'sala_terapia_a_dimensiones': '3×2.5 m (7.5 m²)',
      'sala_terapia_a_capacidad': '1-3 personas',
      'sala_terapia_a_desc': 'Especialmente diseñada para consultas individuales de corta o larga duración. Equipada con todo lo necesario para el profesional de la salud: escritorio, camilla y lavabo.',
      'sala_terapia_a_tarifa_hora': '12€/h',
      'sala_terapia_a_tarifa_dia': '70€/día',
      'sala_terapia_a_tarifa_bono': '110€ (10h)',
      'sala_terapia_a_tarifa_mensual': 'Desde 30€/h',
      'sala_terapia_a_equipo': 'Mesa escritorio, Camilla de examen, Lavabo funcional, Internet Fibra',

      // --- SALA TERAPIA B ---
      'sala_terapia_b_nombre': 'Sala Terapia B',
      'sala_terapia_b_dimensiones': '3×2.5 m (7.5 m²)',
      'sala_terapia_b_capacidad': '1-3 personas',
      'sala_terapia_b_desc': 'Un espacio funcional y tranquilo, optimizado para sesiones individuales de fisioterapia o masajes específicos en un ambiente relajado.',
      'sala_terapia_b_tarifa_hora': '12€/h',
      'sala_terapia_b_tarifa_dia': '70€/día',
      'sala_terapia_b_tarifa_bono': '110€ (10h)',
      'sala_terapia_b_tarifa_mensual': 'Desde 30€/h',
      'sala_terapia_b_equipo': 'Mesa escritorio, Camilla plegable, Internet Fibra, Ambiente Climatizado',

      // --- SALA COMUNITARIA ---
      'sala_comunitaria_nombre': 'Sala Comunitaria',
      'sala_comunitaria_dimensiones': 'Área común con terraza',
      'sala_comunitaria_capacidad': 'Descanso y networking',
      'sala_comunitaria_desc': 'Nuestra sala comunitaria es el corazón social de Onda Vital. Aquí los profesionales y alumnos pueden relajarse entre sesiones, tomar un té o intercambiar ideas en un ambiente distendido.',
      'sala_comunitaria_tarifa_hora': 'Incluido',
      'sala_comunitaria_tarifa_dia': 'N/A',
      'sala_comunitaria_tarifa_bono': 'N/A',
      'sala_comunitaria_tarifa_mensual': 'N/A',
      'sala_comunitaria_equipo': 'Cocina Equipada, Microondas/Nevera, Cafetera/Tetera, Vajilla completa, Terraza exterior',

      // --- FOOTER ---
      'footer_desc': 'Centro de bienestar y técnicas manuales para tu salud integral.',
      'footer_copyright': '© 1996- 2025 Onda Vital Holistic. All Rights Reserved.'
    };
    
    for (const [key, value] of Object.entries(defaults)) {
      insertStmt.run(key, value, 'text', new Date().toISOString());
    }
  } catch (error) {
  console.error("Error sincronizando content_blocks inicial:", error.message);
}

class ContentModel {
  /**
   * Obtiene todos los bloques de contenido formateados como un objeto { clave: valor }.
   */
  static obtenerTodos() {
    const stmt = db.prepare('SELECT key, value FROM content_blocks');
    const rows = stmt.all();
    
    // Convertir el array de filas en un objeto { "home_hero_title": "Valor..." }
    const contentObject = {};
    rows.forEach(row => {
      contentObject[row.key] = row.value;
    });
    
    return contentObject;
  }

  /**
   * Actualiza el valor de un bloque de contenido existente.
   */
  static actualizarValor(key, newValue) {
    const stmt = db.prepare('UPDATE content_blocks SET value = ?, updated_at = ? WHERE key = ?');
    return stmt.run(newValue, new Date().toISOString(), key);
  }
}

module.exports = ContentModel;
