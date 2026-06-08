const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'DVQR';
const hash = bcrypt.hashSync(password, 12);

console.log('--- RESULTADO ---');
console.log(`Original: ${password}`);
console.log(`Hash: ${hash}`);
console.log('-----------------');
