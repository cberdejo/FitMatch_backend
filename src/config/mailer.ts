const { createTransport } = require('nodemailer');

// Configurar el transporter
const transporter = createTransport({
  service: 'gmail', // Servicio de correo electrónico 
  auth: {
    user: process.env.EMAIL, //  dirección de correo de Fit-Match
    pass: process.env.EMAIL_PASSWORD, // contraseña de correo de Fit-Match
  },
});
transporter.verify().then(() => {
  console.log('Server is ready to take our messages');
})

export default transporter;
  transporter
