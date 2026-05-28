// Middleware: authMiddleware.js
// Propósito: Proteger rutas para que solo administradores logueados puedan acceder
// Utiliza el módulo de seguridad reutilizable magicAuth.js

const ChangeLogModel = require('../models/ChangeLogModel');
const createMagicAuth = require('../magicAuth');

const magicAuth = createMagicAuth({
  secretKey: process.env.ADMIN_SECRET_KEY,
  jwtSecret: process.env.JWT_SECRET,
  cookieName: 'adminToken',
  adminPath: '/admin',
  tokenPayload: {
    id: 0,
    username: 'Admin',
    nombre: 'Propietario',
    email: 'admin@ondavital.com',
    role: 'admin',
    permisos: 'admin'
  },
  onLockout: (ip) => {
    console.error(`[SEGURIDAD] IP ${ip} bloqueada temporalmente por intentos fallidos de clave admin.`);
    try {
      ChangeLogModel.registrar({
        adminName: 'Sistema',
        action: 'bruteforce_lockout',
        ip: ip
      });
    } catch (logError) {
      console.warn('No se pudo registrar log de lockout:', logError.message);
    }
  },
  onFailedAttempt: (ip) => {
    try {
      ChangeLogModel.registrar({
        adminName: 'Sistema',
        action: 'failed_key_attempt',
        ip: ip
      });
    } catch (logError) {
      console.warn('No se pudo registrar log de intento fallido:', logError.message);
    }
  }
});

module.exports = {
  verifyToken: magicAuth.verifyToken,
  verifyAdminPage: magicAuth.verifyAdminPage,
  verifyAdmin: magicAuth.verifyAdmin
};
