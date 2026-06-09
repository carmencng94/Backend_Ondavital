const WINDOW_MS = 60 * 60 * 1000; // 1 hora
const MAX_ATTEMPTS = 3; // 3 feedbacks por hora

const attemptsByIp = new Map();

function cleanup(now) {
  for (const [ip, data] of attemptsByIp.entries()) {
    if (now > data.resetAt) attemptsByIp.delete(ip);
  }
}

module.exports = function feedbackRateLimit(req, res, next) {
  const now = Date.now();
  cleanup(now);

  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const current = attemptsByIp.get(ip);

  if (!current || now > current.resetAt) {
    attemptsByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  if (current.count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: 'Has enviado demasiados reportes. Por favor, inténtalo más tarde.'
    });
  }

  current.count += 1;
  attemptsByIp.set(ip, current);
  return next();
};
