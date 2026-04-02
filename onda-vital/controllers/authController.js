// Controller: authController.js
// Propósito: Manejar la autenticación del administrador

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ChangeLogModel = require('../models/ChangeLogModel');

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 8 * 60 * 60 * 1000,
  path: '/'
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASSWORD;
  const adminPassHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.JWT_SECRET;
  
  if (!secret || !adminUser || (!adminPass && !adminPassHash)) {
    console.error("CRITICAL ERROR: Faltan credenciales o JWT_SECRET en entorno.");
    return res.status(500).json({ success: false, message: 'Error interno de despliegue de seguridad. Contacte a soporte.' });
  }

  const usernameMatches = username === adminUser;
  const passwordMatches = adminPassHash
    ? await bcrypt.compare(password || '', adminPassHash)
    : password === adminPass;

  if (usernameMatches && passwordMatches) {
    const token = jwt.sign({ role: 'admin', username }, secret, { expiresIn: '8h' });

    res.cookie('adminToken', token, COOKIE_OPTIONS);

    try {
      ChangeLogModel.registrar({
        adminName: username,
        action: 'login',
        ip: req.ip || 'unknown'
      });
    } catch (logError) {
      console.warn('No se pudo registrar audit_log (login):', logError.message);
    }
    
    return res.json({ success: true, token });
  }

  return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
};

exports.logout = (req, res) => {
  res.clearCookie('adminToken', { ...COOKIE_OPTIONS, maxAge: 0 });
  return res.json({ success: true });
};

exports.session = (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
