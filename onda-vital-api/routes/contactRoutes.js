const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, error: "Has enviado demasiados mensajes. Por favor, espera unos minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

const validateContact = [
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio').escape(),
  body('email').trim().isEmail().withMessage('El email no es válido').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('El mensaje es obligatorio').escape()
];

// Endpoint para enviar correos de contacto
router.post('/', contactLimiter, validateContact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Faltan credenciales SMTP en el archivo .env');
      return res.status(500).json({ success: false, error: 'El servidor no está configurado para enviar correos.' });
    }

    // Configurar transporte SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Usar 'gmail' configura automáticamente el host y puerto correctos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: 'ondavitaloffice@gmail.com',
      subject: `Nuevo mensaje de Contacto Web: ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-top: 5px solid #2B6CB0;">
            <h2 style="color: #2B6CB0; margin-top: 0; font-size: 24px;">Nuevo Mensaje de Contacto</h2>
            <p style="color: #4A5568; font-size: 16px; margin-bottom: 25px;">Has recibido un nuevo mensaje desde el formulario web de Onda Vital.</p>
            
            <div style="background-color: #EDF2F7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; color: #2D3748;"><strong>Nombre:</strong> ${name}</p>
              <p style="margin: 0; color: #2D3748;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3182CE; text-decoration: none;">${email}</a></p>
            </div>
            
            <h3 style="color: #4A5568; font-size: 18px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; margin-bottom: 15px;">Mensaje:</h3>
            <div style="background-color: #ffffff; border: 1px solid #E2E8F0; padding: 20px; border-radius: 6px; color: #2D3748; line-height: 1.6; white-space: pre-wrap; font-size: 15px;">
              ${message}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #A0AEC0; font-size: 13px;">
              <p>Este correo ha sido enviado automáticamente desde ondavital.com</p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo de contacto:', error);
    return res.status(500).json({ success: false, error: 'Hubo un error al enviar el mensaje. Inténtalo más tarde.' });
  }
});

module.exports = router;
