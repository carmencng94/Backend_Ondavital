// Middleware: authMiddleware.js
// Propósito: Proteger rutas para que solo administradores logueados puedan acceder

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // El token normalmente viaja en el header "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ success: false, message: 'Acceso denegado: Se requiere token de autenticación.' });
  }

  const secret = process.env.JWT_SECRET || 'supersecreto_temporal';
  
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Acceso denegado: Token inválido o expirado.' });
    }
    
    req.user = decoded;
    next();
  });
};
