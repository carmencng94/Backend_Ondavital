/**
 * magicAuth.js
 * 
 * Módulo de Autenticación de Enlace Secreto (Magic URL) y Bloqueo de Fuerza Bruta para Express.
 * Diseñado para ser genérico y fácilmente adaptable a cualquier otro proyecto.
 * 
 * REQUISITOS:
 * - npm install jsonwebtoken
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = function createMagicAuth(config = {}) {
  // 1. Configuraciones por defecto
  const secretKey = config.secretKey;
  const jwtSecret = config.jwtSecret;
  const cookieName = config.cookieName || 'adminToken';
  const adminPath = config.adminPath || '/admin';
  const lockoutDuration = config.lockoutDuration || 15 * 60 * 1000; // 15 minutos
  const maxAttempts = config.maxAttempts || 3;
  
  const tokenPayload = config.tokenPayload || {
    id: 0,
    username: 'Admin',
    nombre: 'Propietario',
    email: 'admin@ondavital.com',
    role: 'admin',
    permisos: 'admin'
  };

  // Callbacks para integrar logs con la base de datos de tu proyecto
  const onLockout = config.onLockout || ((ip) => console.warn(`[magicAuth] IP ${ip} bloqueada por fuerza bruta.`));
  const onFailedAttempt = config.onFailedAttempt || ((ip) => console.log(`[magicAuth] Intento fallido desde IP: ${ip}`));

  // Almacenamiento en memoria para el control de IPs
  const adminLockouts = new Map();

  // Limpieza interna periódica de lockouts expirados
  function cleanupLockouts(now) {
    for (const [ip, data] of adminLockouts.entries()) {
      if (now > data.expiry) {
        adminLockouts.delete(ip);
      }
    }
  }

  // Comparación segura en tiempo constante para evitar ataques de temporización
  function safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return false;
    }
    const aHash = crypto.createHash('sha256').update(a).digest();
    const bHash = crypto.createHash('sha256').update(b).digest();
    try {
      return crypto.timingSafeEqual(aHash, bHash);
    } catch (e) {
      return false;
    }
  }

  // Helper para extraer el token de la cookie
  function getCookieToken(req) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return null;
    }
    const prefix = `${cookieName}=`;
    const tokenCookie = cookieHeader
      .split(';')
      .map(part => part.trim())
      .find(part => part.startsWith(prefix));

    return tokenCookie ? decodeURIComponent(tokenCookie.slice(prefix.length)) : null;
  }

  return {
    /**
     * Middleware 1: verifyToken
     * Decodifica y extrae el token JWT opcionalmente de cookies o del header de autorización.
     */
    verifyToken: (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader && authHeader.split(' ')[1];
      const token = bearerToken || getCookieToken(req);

      if (!token) {
        return res.status(403).json({ success: false, message: 'Acceso denegado: Se requiere token de autenticación.' });
      }

      if (!jwtSecret) {
        console.error("[magicAuth] ERROR: jwtSecret no configurado.");
        return res.status(500).json({ success: false, message: 'Error de configuración de seguridad.' });
      }

      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          return res.status(401).json({ success: false, message: 'Acceso denegado: Token inválido o expirado.' });
        }
        req.user = decoded;
        next();
      });
    },

    /**
     * Middleware 2: verifyAdminPage
     * Protege páginas de archivos estáticos. Maneja la URL secreta y bloqueos por IP.
     */
    verifyAdminPage: (req, res, next) => {
      const queryKey = req.query.key;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      const now = Date.now();

      cleanupLockouts(now);

      // A. Verificar si la IP está bloqueada por fuerza bruta
      const lockoutData = adminLockouts.get(ip);
      if (lockoutData && lockoutData.isLocked && now < lockoutData.expiry) {
        console.warn(`[magicAuth] IP bloqueada intentó acceder al panel: ${ip}`);
        return res.status(404).send('Not Found');
      }

      // B. Si se provee la clave secreta por URL (?key=...)
      if (queryKey) {
        if (!secretKey) {
          console.error("[magicAuth] ERROR: secretKey (ADMIN_SECRET_KEY) no configurado en servidor.");
          return res.status(404).send('Not Found');
        }

        if (safeCompare(queryKey, secretKey)) {
          // Clave correcta: limpiar intentos fallidos
          adminLockouts.delete(ip);

          if (!jwtSecret) {
            console.error("[magicAuth] ERROR: jwtSecret no configurado.");
            return res.status(500).send('Error de configuración de seguridad.');
          }

          // Firmar sesión
          const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '8h' });

          const COOKIE_OPTIONS = {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 8 * 60 * 60 * 1000,
            path: '/'
          };

          res.cookie(cookieName, token, COOKIE_OPTIONS);
          return res.redirect(adminPath);
        } else {
          // Clave incorrecta: contar intento fallido
          const attempts = lockoutData ? lockoutData.attempts + 1 : 1;
          const expiry = now + lockoutDuration;
          const isLocked = attempts >= maxAttempts;

          if (isLocked) {
            onLockout(ip);
          } else {
            onFailedAttempt(ip);
          }

          adminLockouts.set(ip, { attempts, expiry, isLocked });
          return res.status(404).send('Not Found');
        }
      }

      // C. Verificación de cookie de sesión tradicional
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader && authHeader.split(' ')[1];
      const token = bearerToken || getCookieToken(req);

      if (!token) {
        return res.status(404).send('Not Found');
      }

      if (!jwtSecret) {
        return res.status(404).send('Not Found');
      }

      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          res.clearCookie(cookieName, { path: '/' });
          return res.status(404).send('Not Found');
        }
        
        // Verificar que la sesión tenga rol de admin
        if (!decoded || decoded.role !== 'admin') {
          return res.status(404).send('Not Found');
        }
        
        req.user = decoded;
        next();
      });
    },

    /**
     * Middleware 3: verifyAdmin (para APIs)
     * Asegura que los endpoints de consulta devuelven datos solo a usuarios autenticados como administrador.
     */
    verifyAdmin: (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader && authHeader.split(' ')[1];
      const token = bearerToken || getCookieToken(req);

      if (!token) {
        return res.status(403).json({ success: false, message: 'Acceso denegado: Se requiere sesión de administrador.' });
      }

      if (!jwtSecret) {
        return res.status(500).json({ success: false, message: 'Error de configuración de seguridad.' });
      }

      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err || !decoded || decoded.role !== 'admin') {
          return res.status(403).json({ success: false, message: 'Acceso denegado: Privilegios insuficientes.' });
        }
        req.user = decoded;
        next();
      });
    }
  };
};
