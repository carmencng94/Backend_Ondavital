require('dotenv').config();
const ContentModel = require('../models/ContentModel');

const updates = {
  es: {
    about_title: "Tu bienestar es el camino de vuelta a ti",
    about_desc: "Onda Vital nace como un santuario de calma en plena ciudad, un espacio dedicado a recordarte que mereces vivir con plenitud. A través de la quiropráctica suave (NSA), talleres conscientes y terapias integrativas, te acompañamos a restaurar tu equilibrio natural y reconectar con la sabiduría de tu cuerpo. Además, abrimos nuestras puertas a la comunidad ofreciendo el alquiler de salas polivalentes inspiradoras, ideales para terapeutas y facilitadores que deseen compartir sus clases, talleres o eventos de crecimiento personal en un entorno armónico. Regálate el tiempo para respirar, sentir y florecer.",
    about_img_label_1: "Sala Jardín 🌿",
    about_img_label_2: "Quiropráctica Suave ✨",
    about_img_label_3: "Sala Azul 🧘"
  },
  en: {
    about_title: "Your well-being is the journey back to yourself",
    about_desc: "Onda Vital was born as a sanctuary of stillness in the heart of the city, a space dedicated to reminding you that you deserve to live fully. Through gentle chiropractic care (NSA), mindful workshops, and integrative therapies, we guide you in restoring your natural balance and reconnecting with your body. Furthermore, we open our doors to the community by offering inspiring multipurpose room rentals, ideal for therapists and facilitators who wish to share their classes, workshops, or personal growth events in a harmonious environment. Give yourself the time to breathe, feel, and flourish.",
    about_img_label_1: "Garden Room 🌿",
    about_img_label_2: "Gentle Chiropractic ✨",
    about_img_label_3: "Blue Room 🧘"
  },
  de: {
    about_title: "Ihr Wohlbefinden ist der Weg zurück zu sich selbst",
    about_desc: "Onda Vital wurde als Oase der Stille im Herzen der Stadt geschaffen, ein Raum, der Sie daran erinnern soll, dass Sie es verdienen, das Leben in seiner ganzen Fülle zu genießen. Durch sanfte Chiropraktik (NSA), achtsame Workshops und integrative Therapien begleiten wir Sie dabei, Ihr natürliches Gleichgewicht wiederherzustellen und sich mit Ihrem Körper zu verbinden. Darüber hinaus öffnen wir unsere Türen für die Gemeinschaft und bieten die Vermietung inspirierender Mehrzweckräume an – ideal für Therapeuten und Kursleiter, die ihre Kurse, Workshops oder Veranstaltungen zur persönlichen Weiterentwicklung in einer harmonischen Umgebung anbieten möchten. Schenken Sie sich die Zeit zum Atmen, Fühlen und Aufblühen.",
    about_img_label_1: "Gartenzimmer 🌿",
    about_img_label_2: "Sanfte Chiropraktik ✨",
    about_img_label_3: "Blaues Zimmer 🧘"
  },
  ca: {
    about_title: "El teu benestar és el camí de tornada a tu",
    about_desc: "Onda Vital neix com un santuari de calma en plena ciutat, un espai dedicat a recordar-te que mereixes viure amb plenitud. A través de la quiropràctica suau (NSA), tallers conscients i teràpies integratives, t'acompanyem a restaurar el teu equilibri natural i reconnectar amb el teu cos. A més, obrim les nostres portes a la comunitat oferint el lloguer de sales polivalentes inspiradores, ideals per a terapeutes i facilitadors que vulguin compartir les seves classes, tallers o esdeveniments de creixement personal en un entorn harmònic. Regala't el temps per respirar, sentir i florir.",
    about_img_label_1: "Sala Jardí 🌿",
    about_img_label_2: "Quiropràctica Suau ✨",
    about_img_label_3: "Sala Blava 🧘"
  }
};

try {
  console.log('=== ACTUALIZACIÓN DE CONTENIDOS EN BASE DE DATOS ===');
  Object.keys(updates).forEach(lang => {
    console.log(`\nActualizando idioma: [${lang.toUpperCase()}]`);
    Object.keys(updates[lang]).forEach(key => {
      const val = updates[lang][key];
      ContentModel.actualizarValor(key, val, lang);
      console.log(`- Clave '${key}' actualizada con éxito.`);
    });
  });
  console.log('\n✅ ¡Actualización de base de datos completada con éxito!');
} catch (error) {
  console.error('❌ Error al actualizar contenidos:', error.message);
}
