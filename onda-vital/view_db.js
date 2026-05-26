require('dotenv').config();
const ReservaModel = require('./models/ReservaModel');
const ContentModel = require('./models/ContentModel');

console.log('=== VERIFICACIÓN DEL BACKEND ===');
console.log('Verificando que la base de datos unificada se cargue correctamente a través del modelo...\n');

try {
  const reservas = ReservaModel.obtenerTodas();
  console.log(`✅ Total de reservas en el modelo: ${reservas.length}`);
  console.log('\nListado de reservas unificadas:');
  console.table(reservas.map(r => ({
    id: r.id,
    nombre: r.nombre,
    sala: r.sala,
    fecha: r.fecha,
    horario: r.horario,
    estado: r.estado,
    createdAt: r.createdAt
  })));
  
  const content = ContentModel.obtenerTodos('flat');
  console.log(`\n✅ Total de bloques de contenido cargados: ${Object.keys(content).length}`);
  
  // Imprimir un par de textos de ejemplo para verificar que se leen las traducciones / contenido unificado
  console.log('\nEjemplos de bloques de contenido:');
  console.log(`- home_hero_title: "${content.home_hero_title}"`);
  console.log(`- contacto_email: "${content.contacto_email}"`);
} catch (error) {
  console.error('❌ Error al realizar la verificación del modelo:', error.message);
}
