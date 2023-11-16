const nodemailer = require('nodemailer');

// Configurar el transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Servicio de correo electrónico 
  auth: {
    user: process.env.EMAIL, //  dirección de correo de Fit-Match
    pass: process.env.EMAIL_PASSWORD, // contraseña de correo de Fit-Match
  },
});

export default transporter;