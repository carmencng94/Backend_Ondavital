require('dotenv').config();
const ContentModel = require('../models/ContentModel');

const updates = {
  es: {
    about_desc_1: "A través de la quiropráctica suave (NSA), te acompañamos a liberar la tensión acumulada, restaurar tu equilibrio natural y reconectar con la sabiduría profunda de tu cuerpo. Un espacio idóneo para recuperar tu energía y vitalidad.",
    about_desc_2: "Abrimos nuestras puertas a la comunidad ofreciendo el alquiler de salas polivalentes inspiradoras, ideales para terapeutas y facilitadores que deseen compartir sus clases, talleres o eventos de crecimiento personal en un entorno armónico. Diseñados con luz natural y suelo de madera para tu total comodidad."
  },
  en: {
    about_desc_1: "Through gentle chiropractic care (NSA), we guide you in releasing stored tension, restoring your natural balance, and reconnecting with the deep wisdom of your body. A perfect space to reclaim your energy and vitality.",
    about_desc_2: "We open our doors to the community by offering inspiring multipurpose room rentals, ideal for therapists and facilitators who wish to share their classes, workshops, or personal growth events in a harmonious environment. Designed with natural light and wooden floors for your absolute comfort."
  },
  de: {
    about_desc_1: "Durch sanfte Chiropraktik (NSA) begleiten wir Sie dabei, angestaute Spannungen abzubauen, Ihr natürliches Gleichgewicht wiederherzustellen und sich wieder mit der tiefen Weisheit Ihres Körpers zu verbinden. Ein idealer Ort, um Ihre Energie und Vitalität zurückzugewinnen.",
    about_desc_2: "Wir öffnen unsere Türen für die Gemeinschaft und bieten die Vermietung inspirierender Mehrzweckräume an – ideal für Therapeuten und Kursleiter, die ihre Kurse, Workshops oder Veranstaltungen zur persönlichen Weiterentwicklung in einer harmonischen Umgebung anbieten möchten. Ausgestattet mit Tageslicht und Holzböden für Ihren absoluten Komfort."
  },
  ca: {
    about_desc_1: "A través de la quiropràctica suau (NSA), t'acompanyem a alliberar la tensió acumulada, restaurar el teu equilibri natural i reconnectar amb la saviesa profunda del teu cos. Un espai idoni per recuperar la teva energia i vitalitat.",
    about_desc_2: "Obrim les nostres portes a la comunitat oferint el lloguer de sales polivalents inspiradores, ideals per a terapeutes i facilitadors que vulguin compartir les seves classes, tallers o esdeveniments de creixement personal en un entorn harmònic. Dissenyats amb llum natural i terra de fusta per a la teva total comoditat."
  }
};

try {
  console.log('=== AÑADIENDO NUEVAS CLAVES SOBRE NOSOTROS ("about_desc_1" e "about_desc_2") ===');
  Object.keys(updates).forEach(lang => {
    console.log(`\nProcesando idioma: [${lang.toUpperCase()}]`);
    Object.keys(updates[lang]).forEach(key => {
      const val = updates[lang][key];
      ContentModel.actualizarValor(key, val, lang);
      console.log(`- Clave '${key}' guardada en DB.`);
    });
  });
  console.log('\n✅ ¡Claves guardadas exitosamente en SQLite!');
} catch (error) {
  console.error('❌ Error al actualizar DB:', error.message);
}
