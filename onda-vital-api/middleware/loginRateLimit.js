const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

// Mapa en memoria por IP: cuenta intentos y cuando se reinicia la ventana.
const attemptsByIp = new Map();

function cleanup(now) {
  // Limpieza basica para que la memoria no crezca indefinidamente.
  for (const [ip, data] of attemptsByIp.entries()) {
    if (now > data.resetAt) attemptsByIp.delete(ip);
  }
}

module.exports = function loginRateLimit(req, res, next) {
  const now = Date.now();
  cleanup(now);

  // Tomamos la IP del request para limitar intentos por cliente.
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const current = attemptsByIp.get(ip);

  // Primer intento (o ventana expirada): reiniciamos contador.
  if (!current || now > current.resetAt) {
    attemptsByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  // Si supera el limite, devolvemos 429 (Too Many Requests).
  if (current.count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: 'Demasiados intentos de login. Espera 15 minutos.'
    });
  }

  // Si aun no supera el limite, permitimos y sumamos intento.
  current.count += 1;
  attemptsByIp.set(ip, current);
  return next();
};