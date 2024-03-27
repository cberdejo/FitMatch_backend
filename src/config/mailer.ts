
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




function sendEmail(mailOptions: any) {
  transporter.sendMail(mailOptions, (error:any, info:any) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
function generateOptions ( to: string, subject: string, text: string, html: string ) {
  return {
    from: process.env.EMAIL, // Dirección de correo electrónico del remitente, debe ser la misma que has configurado en el transporter
    to: to, // Dirección de correo electrónico del destinatario
    subject: subject, // Asunto del correo
    text: text, // Cuerpo del correo en texto plano
    html: html, // Cuerpo del correo en HTML (opcional)
  }
}


export function sendOTPMessage ( to: string, otp:string) {
  const subject = 'Fit-Match - Código de verificación';
  const text = `Su código de verificación es: ${otp}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>¡Hola!</h2>
      <p>Su código de verificación para Fit-Match es:</p>
      <p style="font-size: 24px; font-weight: bold;">${otp}</p>
      <p>Este código es válido solo por unos minutos. Por favor, no lo comparta con nadie.</p>
      <footer>
        <p>Gracias por usar Fit-Match.</p>
      </footer>
    </div>
  `;
  const mailOptions = generateOptions(to, subject, text, html);
  sendEmail(mailOptions);
}

