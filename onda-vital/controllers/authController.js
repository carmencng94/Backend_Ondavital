// Controller: authController.js
// Propósito: Manejar la autenticación del administrador

const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { username, password } = req.body;

  // Validación estática temporal pedida por el cliente
  if (username === 'DVQR' && password === 'DVQR') {
    const secret = process.env.JWT_SECRET || 'supersecreto_temporal';
    
    // Generamos un token que expira en 8 horas
    const token = jwt.sign({ role: 'admin', username }, secret, { expiresIn: '8h' });
    
    return res.json({ success: true, token });
  }

  // Si falla, responder con 401 Unauthorized
  return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
};
