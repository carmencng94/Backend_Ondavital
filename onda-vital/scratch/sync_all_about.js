require('dotenv').config();
const ContentModel = require('../models/ContentModel');
const db = require('better-sqlite3')(process.env.DB_PATH || 'memory.db');

const data = {
  es: {
    about_title: "Tu bienestar es el camino de vuelta a ti",
    about_desc: "Onda Vital nace como un santuario de calma en plena ciudad, un espacio dedicado a recordarte que mereces vivir con plenitud. A través de la quiropráctica suave (NSA), talleres conscientes y terapias integrativas, te acompañamos a restaurar tu equilibrio natural y reconectar con la sabiduría de tu cuerpo. Además, abrimos nuestras puertas a la comunidad ofreciendo el alquiler de salas polivalentes inspiradoras, ideales para terapeutas y facilitadores que deseen compartir sus clases, talleres o eventos de crecimiento personal en un entorno armónico. Regálate el tiempo para respirar, sintiéndose y florecer.",
    about_desc_1: "A través de la quiropráctica suave (NSA), te acompañamos a liberar la tensión acumulada, restaurar tu equilibrio natural y reconectar con la sabiduría profunda de tu cuerpo. Un espacio idóneo para recuperar tu energía y vitalidad.",
    about_desc_2: "Abrimos nuestras puertas a la comunidad ofreciendo el alquiler de salas polivalentes inspiradoras, ideales para terapeutas y facilitadores que deseen compartir sus clases, talleres o eventos de crecimiento personal en un entorno armónico. Diseñados con luz natural y suelo de madera para tu total comodidad.",
    about_img_label_1: "Sala Jardín 🌿",
    about_img_label_2: "Quiropráctica Suave ✨",
    about_img_label_3: "Sala Azul 🧘"
  },
  en: {
    about_title: "Your well-being is the journey back to yourself",
    about_desc: "Onda Vital was born as a sanctuary of stillness in the heart of the city, a space dedicated to reminding you that you deserve to live fully. Through gentle chiropractic care (NSA), mindful workshops, and integrative therapies, we guide you in restoring your natural balance and reconnecting with your body. Furthermore, we open our doors to the community by offering inspiring multipurpose room rentals, ideal for therapists and facilitators who wish to share their classes, workshops, or personal growth events in a harmonious environment. Give yourself the time to breathe, feel, and flourish.",
    about_desc_1: "Through gentle chiropractic care (NSA), we guide you in releasing stored tension, restoring your natural balance, and reconnecting with the deep wisdom of your body. A perfect space to reclaim your energy and vitality.",
    about_desc_2: "We open our doors to the community by offering inspiring multipurpose room rentals, ideal for therapists and facilitators who wish to share their classes, workshops, or personal growth events in a harmonious environment. Designed with natural light and wooden floors for your absolute comfort.",
    about_img_label_1: "Garden Room 🌿",
    about_img_label_2: "Gentle Chiropractic ✨",
    about_img_label_3: "Blue Room 🧘"
  },
  de: {
    about_title: "Ihr Wohlbefinden ist der Weg zurück zu sich selbst",
    about_desc: "Onda Vital wurde als Oase der Stille im Herzen der Stadt geschaffen, ein Raum, der Sie daran erinnern soll, dass Sie es verdienen, das Leben in seiner ganzen Fülle zu genießen. Durch sanfte Chiropraktik (NSA), achtsame Workshops und integrative Therapien begleiten wir Sie dabei, Ihr natürliches Gleichgewicht wiederherzustellen und sich mit Ihrem Körper zu verbinden. Darüber hinaus öffnen wir unsere Türen für die Gemeinschaft und bieten die Vermietung inspirierender Mehrzweckräume an – ideal für Therapeuten und Kursleiter, die ihre Kurse, Workshops oder Veranstaltungen zur persönlichen Weiterentwicklung in einer harmonischen Umgebung anbieten möchten. Schenken Sie sich die Zeit zum Atmen, Fühlen und Aufblühen.",
    about_desc_1: "Durch sanfte Chiropraktik (NSA) begleiten wir Sie dabei, angestaute Spannungen abzubauen, Ihr natürliches Gleichgewicht wiederherzustellen und sich wieder mit der tiefen Weisheit Ihres Körpers zu verbinden. Ein idealer Ort, um Ihre Energie und Vitalität zurückzugewinnen.",
    about_desc_2: "Wir öffnen unsere Türen für die Gemeinschaft und bieten die Vermietung inspirierender Mehrzweckräume an – ideal für Therapeuten und Kursleiter, die ihre Kurse, Workshops oder Veranstaltungen zur persönlichen Weiterentwicklung in einer harmonischen Umgebung anbieten möchten. Ausgestattet mit Tageslicht und Holzböden für Ihren absoluten Komfort.",
    about_img_label_1: "Gartenzimmer 🌿",
    about_img_label_2: "Sanfte Chiropraktik ✨",
    about_img_label_3: "Blaues Zimmer 🧘"
  },
  ca: {
    about_title: "El teu benestar és el camí de tornada a tu",
    about_desc: "Onda Vital neix com un santuari de calma en plena ciutat, un espai dedicat a recordar-te que mereixes viure amb plenitud. A través de la quiropràctica suau (NSA), tallers conscients i teràpies integratives, t'acompanyem a restaurar el teu equilibri natural i reconnectar amb el teu cos. A més, obrim les nostres portes a la comunitat oferint el lloguer de sales polivalentes inspiradores, ideals per a terapeutes i facilitadors que vulguin compartir les seves classes, tallers o esdeveniments de creixement personal en un entorn harmònic. Regala't el temps per respirar, sentir i florir.",
    about_desc_1: "A través de la quiropràctica suau (NSA), t'acompanyem a alliberar la tensió acumulada, restaurar el teu equilibri natural i reconnectar amb la saviesa profunda del teu cos. Un espai idoni per recuperar la teva energia i vitalitat.",
    about_desc_2: "Obrim les nostres portes a la comunitat oferint el lloguer de sales polivalents inspiradores, ideals per a terapeutes i facilitadors que vulguin compartir les seves classes, tallers o esdeveniments de creixement personal en un entorn harmònic. Dissenyats amb llum natural i terra de fusta per a la teva total comoditat.",
    about_img_label_1: "Sala Jardí 🌿",
    about_img_label_2: "Quiropràctica Suau ✨",
    about_img_label_3: "Sala Blava 🧘"
  }
};

try {
  console.log('=== SINCRONIZACIÓN COMPLETA DE TRADUCCIONES DE SOBRE NOSOTROS ===');
  
  // 1. Asegurar que las filas existan en la tabla content_blocks
  const keys = Object.keys(data.es);
  const insertStmt = db.prepare('INSERT OR IGNORE INTO content_blocks (key, value, type, updated_at) VALUES (?, ?, ?, ?)');
  
  keys.forEach(key => {
    insertStmt.run(key, data.es[key], 'text', new Date().toISOString());
    console.log(`- Fila asegurada para la clave: '${key}'`);
  });

  // 2. Actualizar las traducciones para todos los idiomas
  Object.keys(data).forEach(lang => {
    console.log(`\nActualizando traducciones para idioma: [${lang.toUpperCase()}]`);
    keys.forEach(key => {
      const val = data[lang][key];
      ContentModel.actualizarValor(key, val, lang);
      console.log(`  - Clave '${key}' -> OK.`);
    });
  });
  
  console.log('\n✅ ¡Base de datos SQLite sincronizada exitosamente con todas las traducciones!');
} catch (error) {
  console.error('❌ Error durante la sincronización:', error.message);
}
