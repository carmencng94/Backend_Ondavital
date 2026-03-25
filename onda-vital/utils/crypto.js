// Utils: crypto.js
// Propósito: Funciones de encriptación y desencriptación para cumplir con AESIA 2026.
const crypto = require('crypto');

// Usamos el environment o generamos uno fallback de 32 bytes para dev.
// EN PRODUCCIÓN DEFINIR ESTA VARIABLE DE ENTORNO.
const algorithm = 'aes-256-gcm';
const secretKey = process.env.AES_SECRET_KEY || crypto.randomBytes(32).toString('hex').slice(0, 32);

/**
 * Encripta un texto usando AES-256-GCM.
 * @param {string} text - Texto a encriptar
 * @returns {string} - Cadena con el formato iv:authTag:encryptedText
 */
function encryptData(text) {
  if (!text) return text;
  
  const iv = crypto.randomBytes(16);
  // La key en aes-256 debe ser exactamente 32 bytes.
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Desencripta un texto usando AES-256-GCM.
 * @param {string} encryptedText - Cadena con el formato iv:authTag:encryptedText
 * @returns {string} - Texto original
 */
function decryptData(hash) {
  if (!hash) return hash;
  
  try {
    const parts = hash.split(':');
    if (parts.length !== 3) return hash; // No está encriptado con nuestro formato actual
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error desencriptando datos:', error.message);
    return hash; // Fallback al original si falla (por ej. keys rotadas y sin manejo de versioning en dev)
  }
}

module.exports = {
  encryptData,
  decryptData
};
