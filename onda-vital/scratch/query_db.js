const http = require('http');

http.get('http://localhost:3051/api/salas', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const d = JSON.parse(data);
      console.log('SALAS CATALOG:');
      const salas = d.salas || [];
      salas.forEach(s => {
        console.log(`- ${s.nombre} (${s.id}):`);
        console.log(`  dbKey: ${s.dbKey}`);
        console.log(`  descripcionLarga: ${s.descripcionLarga.substring(0, 70)}...`);
      });
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
}).on('error', (err) => {
  console.error('Error on request:', err);
});
