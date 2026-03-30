const Database = require('better-sqlite3');
const db = new Database('./memory.db');

const translations = {
  // Sala Jardín (G1)
  'sala_jardin_nombre': {
    es: 'Sala Jardín (G1)',
    en: 'Garden Room (G1)',
    de: 'Gartenraum (G1)',
    ca: 'Sala Jardí (G1)'
  },
  'sala_jardin_dimensiones': {
    es: '8.5 x 4.5 m (32 m²)',
    en: '8.5 x 4.5 m (32 m²)',
    de: '8.5 x 4.5 m (32 m²)',
    ca: '8.5 x 4.5 m (32 m²)'
  },
  'sala_jardin_capacidad': {
    es: '10 personas (suelo) / 25 personas (sillas)',
    en: '10 people (floor) / 25 people (chairs)',
    de: '10 Personen (Boden) / 25 Personen (Stühle)',
    ca: '10 persones (terra) / 25 persones (cadires)'
  },
  'sala_jardin_desc': {
    es: 'Sala con vistas y acceso directo a nuestro jardín-oasis. Un espacio tranquilo y hermoso ideal para clases de Yoga, meditación o talleres grupales.',
    en: 'Room with views and direct access to our garden-oasis. A quiet and beautiful space ideal for Yoga classes, meditation, or group workshops.',
    de: 'Raum mit Blick und direktem Zugang zu unserem Garten-Oase. Ein ruhiger und schöner Raum, ideal für Yoga-Kurse, Meditation oder Gruppenworkshops.',
    ca: 'Sala amb vistes i accés directe al nostre jardí-oasi. Un espai tranquil i bonic ideal per a classes de Ioga, meditació o tallers grupals.'
  },
  'sala_jardin_equipo': {
    es: 'Proyector, Sistema de Sonido, Sillas plegables, Esterillas, Internet Fibra, Aire Acondicionado, Barra coffee break, Acceso a Jardín',
    en: 'Projector, Sound System, Folding Chairs, Mats, Fiber Internet, Air Conditioning, Coffee Break Bar, Garden Access',
    de: 'Projektor, Soundsystem, Klappstühle, Matten, Glasfaser-Internet, Klimaanlage, Kaffeepausen-Bar, Gartenzugang',
    ca: 'Projector, Sistema de So, Cadires plegables, Esterilles, Internet Fibra, Aire Acondicionat, Barra coffee break, Accés a Jardí'
  },

  // Sala Azul (G2)
  'sala_azul_nombre': {
    es: 'Sala Azul (G2)',
    en: 'Blue Room (G2)',
    de: 'Blauer Raum (G2)',
    ca: 'Sala Blava (G2)'
  },
  'sala_azul_dimensiones': {
    es: '6.5 x 5 m (32 m²)',
    en: '6.5 x 5 m (32 m²)',
    de: '6.5 x 5 m (32 m²)',
    ca: '6.5 x 5 m (32 m²)'
  },
  'sala_azul_capacidad': {
    es: 'Hasta 10 camillas / 30 personas sentadas',
    en: 'Up to 10 massage tables / 30 seated people',
    de: 'Bis zu 10 Behandlungstische / 30 sitzende Personen',
    ca: 'Fins a 10 camilles / 30 persones assegudes'
  },
  'sala_azul_desc': {
    es: 'Sala luminosa con vistas al jardín frondoso. Equipada con moqueta y camillas, es perfecta para formaciones de terapias manuales o charlas.',
    en: 'Bright room with views of the lush garden. Equipped with carpet and massage tables, it is perfect for manual therapy training or talks.',
    de: 'Heller Raum mit Blick auf den üppigen Garten. Ausgestattet mit Teppich und Behandlungstischen, ist er perfekt für manuelle Therapieausbildungen oder Vorträge.',
    ca: 'Sala lluminosa amb vistes al jardí frondós. Equipada amb moqueta i camilles, és perfecta per a formacions de teràpies manuals o xerrades.'
  },
  'sala_azul_equipo': {
    es: 'Moqueta Premium, 8 Camillas, Proyector, Sistema de Sonido, Internet Fibra, Aire Acondicionado, Vistas al Jardín',
    en: 'Premium Carpet, 8 Massage Tables, Projector, Sound System, Fiber Internet, Air Conditioning, Garden Views',
    de: 'Premium-Teppich, 8 Behandlungstische, Projektor, Soundsystem, Glasfaser-Internet, Klimaanlage, Gartenblick',
    ca: 'Moqueta Premium, 8 Camilles, Projector, Sistema de So, Internet Fibra, Aire Acondicionat, Vistes al Jardí'
  },

  // Despacho Plus
  'sala_despacho_plus_nombre': {
    es: 'Despacho+',
    en: 'Office Plus',
    de: 'Büro Plus',
    ca: 'Despatx+'
  },
  'sala_despacho_plus_dimensiones': {
    es: '4.1 x 3.2 m',
    en: '4.1 x 3.2 m',
    de: '4.1 x 3.2 m',
    ca: '4.1 x 3.2 m'
  },
  'sala_despacho_plus_capacidad': {
    es: 'Consultas individuales / Hasta 8 personas para charlas',
    en: 'Individual consultations / Up to 8 people for talks',
    de: 'Einzelberatungen / Bis zu 8 Personen für Vorträge',
    ca: 'Consultes individuals / Fins a 8 persones per a xerrades'
  },
  'sala_despacho_plus_desc': {
    es: 'Despacho luminoso y privado con vistas al jardín. Ideal para consultas, terapias individuales o reuniones de grupos pequeños.',
    en: 'Bright and private office with garden views. Ideal for consultations, individual therapies, or small group meetings.',
    de: 'Helles und privates Büro mit Gartenblick. Ideal für Beratungen, Einzeltherapien oder kleine Gruppenmeetings.',
    ca: 'Despatx lluminós i privat amb vistes al jardí. Ideal per a consultes, teràpies individuals o reunions de grups petits.'
  },
  'sala_despacho_plus_equipo': {
    es: 'Mesa y Sillas, Camilla de Terapias, Luz Natural, Aire Acondicionado, Internet Fibra',
    en: 'Table and Chairs, Therapy Table, Natural Light, Air Conditioning, Fiber Internet',
    de: 'Tisch und Stühle, Behandlungstisch, Tageslicht, Klimaanlage, Glasfaser-Internet',
    ca: 'Taula i Cadires, Camilla de Teràpies, Llum Natural, Aire Acondicionat, Internet Fibra'
  },

  // Sala Terapia A
  'sala_terapia_a_nombre': {
    es: 'Sala Terapia A',
    en: 'Therapy Room A',
    de: 'Therapieraum A',
    ca: 'Sala Teràpia A'
  },
  'sala_terapia_a_desc': {
    es: 'Sala tranquila ideal para consultas y terapias individuales en un ambiente acogedor.',
    en: 'Quiet room ideal for consultations and individual therapies in a cozy atmosphere.',
    de: 'Ruhiger Raum, ideal für Beratungen und Einzeltherapien in gemütlicher Atmosphäre.',
    ca: 'Sala tranquila ideal per a consultes i teràpies individuals en un ambient acollidor.'
  },
  'sala_terapia_a_equipo': {
    es: 'Mesa escritorio, Camilla, Lavabo funcional, Internet Fibra',
    en: 'Desk, Massage Table, Functional Sink, Fiber Internet',
    de: 'Schreibtisch, Behandlungstisch, Waschbecken, Glasfaser-Internet',
    ca: 'Taula escriptori, Camilla, Lavabo funcional, Internet Fibra'
  },

  // Sala Terapia B
  'sala_terapia_b_nombre': {
    es: 'Sala Terapia B',
    en: 'Therapy Room B',
    de: 'Therapieraum B',
    ca: 'Sala Teràpia B'
  },
  'sala_terapia_b_desc': {
    es: 'Espacio funcional optimizado para sesiones individuales de fisioterapia o masajes.',
    en: 'Functional space optimized for individual physiotherapy or massage sessions.',
    de: 'Funktioneller Raum, optimiert für Einzelphysiotherapie oder Massage-Sitzungen.',
    ca: 'Espai funcional optimitzat per a sessions individuals de fisioteràpia o massatges.'
  },
  'sala_terapia_b_equipo': {
    es: 'Mesa escritorio, Camilla plegable, Internet Fibra',
    en: 'Desk, Folding Massage Table, Fiber Internet',
    de: 'Schreibtisch, Zusammenklappbarer Behandlungstisch, Glasfaser-Internet',
    ca: 'Taula escriptori, Camilla plegable, Internet Fibra'
  },

  // Sala Comunitaria
  'sala_comunitaria_nombre': {
    es: 'Sala Comunitaria',
    en: 'Community Room',
    de: 'Gemeinschaftsraum',
    ca: 'Sala Comunitària'
  },
  'sala_comunitaria_desc': {
    es: 'Espacio común para descansar, charlar o comer. Incluido en el alquiler de la Sala Jardín.',
    en: 'Common space for resting, chatting, or eating. Included in the Garden Room rental.',
    de: 'Gemeinschaftsraum zum Ausruhen, Plaudern oder Essen. Inbegriffen in der Miete des Gartenraums.',
    ca: 'Espai comú per descansar, xerrar o menjar. Inclòs en el lloguer de la Sala Jardí.'
  },
  'sala_comunitaria_equipo': {
    es: 'Nevera, Microondas, Tetera Eléctrica, Vajilla completa, Terraza y Jardín',
    en: 'Fridge, Microwave, Electric Kettle, Full Tableware, Terrace and Garden',
    de: 'Kühlschrank, Mikrowelle, Wasserkocher, komplettes Geschirr, Terrasse und Garten',
    ca: 'Nevera, Microones, Tetera Elèctrica, Vaixella completa, Terrassa i Jardí'
  }
};

const updateStmt = db.prepare('UPDATE content_blocks SET value = ?, value_en = ?, value_de = ?, value_ca = ?, updated_at = ? WHERE key = ?');

for (const [key, sets] of Object.entries(translations)) {
  updateStmt.run(sets.es, sets.en, sets.de, sets.ca, new Date().toISOString(), key);
}

console.log('Base de datos actualizada con los nuevos detalles de las salas y traducciones.');
