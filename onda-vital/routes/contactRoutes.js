const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Endpoint para enviar correos de contacto
router.post('/', async (req, res) => {
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
      subject: `Contacto Web Onda Vital - ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error al enviar el correo de contacto:', error);
    return res.status(500).json({ success: false, error: 'Hubo un error al enviar el mensaje. Inténtalo más tarde.' });
  }
});

module.exports = router;
