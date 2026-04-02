// Middleware: authMiddleware.js
// Propósito: Proteger rutas para que solo administradores logueados puedan acceder

const jwt = require('jsonwebtoken');

function getCookieToken(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const tokenCookie = cookieHeader
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('adminToken='));

  if (!tokenCookie) {
    return null;
  }

  return decodeURIComponent(tokenCookie.slice('adminToken='.length));
}

exports.verifyToken = (req, res, next) => {
  // El token puede viajar en cookie httpOnly o en Authorization para compatibilidad.
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  const token = bearerToken || getCookieToken(req);

  if (!token) {
    return res.status(403).json({ success: false, message: 'Acceso denegado: Se requiere token de autenticación.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("ATENCIÓN: Se intentó usar JWT sin un JWT_SECRET configurado en entorno.");
    return res.status(500).json({ success: false, message: 'Error de configuración de seguridad.' });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Acceso denegado: Token inválido o expirado.' });
    }
    
    req.user = decoded;
    next();
  });
};
