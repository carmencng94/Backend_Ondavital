const { spawn } = require('child_process');

const server = spawn('node', ['server.js']);
console.log('Iniciando servidor...');

server.stdout.on('data', data => {
  if (data.toString().includes('escuchando')) {
    console.log('Servidor listo, ejecutando pruebas...');
  }
});

setTimeout(async () => {
  try {
    console.log('\n--- Probando POST /api/contact (Validación y CSP) ---');
    const res1 = await fetch('http://localhost:3051/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data1 = await res1.json();
    console.log('Status Code:', res1.status, '(Esperado: 400)');
    console.log('Respuesta:', data1);
    console.log('Cabecera CSP presente:', !!res1.headers.get('content-security-policy'));

    console.log('\n--- Probando POST /api/reservas (Validación) ---');
    const res2 = await fetch('http://localhost:3051/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data2 = await res2.json();
    console.log('Status Code:', res2.status, '(Esperado: 400)');
    console.log('Respuesta:', data2);

  } catch (e) {
    console.error('Error en fetch:', e.message);
  } finally {
    server.kill();
    process.exit(0);
  }
}, 2500);
