require('dotenv').config();
const ContentModel = require('../models/ContentModel');

try {
  const content = ContentModel.obtenerTodos('all');
  console.log('=== TRADUCCIONES ACTUALES DE SOBRE NOSOTROS ("about_") ===');
  
  const langs = ['es', 'en', 'de', 'ca'];
  langs.forEach(lang => {
    console.log(`\n--- IDIOMA: [${lang.toUpperCase()}] ---`);
    if (content[lang]) {
      Object.keys(content[lang]).forEach(key => {
        if (key.startsWith('about_') || key.startsWith('contacto_horarios_')) {
          console.log(`- ${key}: "${content[lang][key]}"`);
        }
      });
    } else {
      console.log('No hay contenido para este idioma.');
    }
  });
} catch (error) {
  console.error('Error al consultar base de datos:', error.message);
}
