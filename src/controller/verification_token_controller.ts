import { Request, Response } from 'express';
import {
    getVerificationTokenService,
    createVerificationTokenService,
    
} from '../service/verification_token_service';

import transporter from "../config/mailer";  
import * as crypto from 'crypto';

 
  
  /**
   * Controlador para verificar el token de verificación.
   * @param req - Objeto de solicitud de Express.
   * @param res - Objeto de respuesta de Express.
   */
  async function tokenIsValid(req: Request, res: Response) {
    try {
      const { email, verificationToken } = req.body;
      const verificationTokenObject = await getVerificationTokenService(email, verificationToken);
      if (verificationTokenObject) {
        
        // Después de verificar el token en el backend
      return res.redirect(`${process.env.FRONTEND_URL}/verificacion-exitosa?email=${email}&token=${verificationToken}`);

      } else {
        return res.status(404).json({ status: 'error', error: 'Token de verificación no encontrado' });
      }
  
    } catch (error) {
      console.error('Error al obtener el estado de validación del token', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  

  
  
  async function createVerificationToken(req: Request, res: Response) {
    try {
      const { email } = req.body;
      
      const emailToken = crypto.randomBytes(64).toString('hex'); // Corrige aquí
      
      
      const fechaActual = new Date();
      const minutosExpiracion: number = parseInt(process.env.MINUTOS_EXPIRACION_TOKEN_VERIFICACION || '15', 10);
      
      const fechaEnXMinutos = new Date(fechaActual.getTime() + minutosExpiracion * 60 * 1000);
      
      const tokenObject = {
        token: emailToken,
        email: email,
        //createdAt: new Date(), 
        expiresAt: fechaEnXMinutos,
      }
      
      const verificationTokenObject = await createVerificationTokenService(tokenObject);
     
        
  
      res.status(200).json(verificationTokenObject);
    }catch(error){
      console.error('Error al crear el token de verificación', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

 /**
 * Envía un correo para verificar una cuenta.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function sendConfirmationMail(req: Request, res: Response) {
    try {
      const { email, verificationToken } = req.body;
      const confirmationLink = `${process.env.FRONTEND_URL}/verificar?token=${verificationToken}&email=${email}`;
  
      await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email,
        subject: 'Confirmación de Registro en Fit-Match',
        html: `
          <p>Estimado usuario de Google,</p>
          <p>Gracias por registrarte en Fit-Match. Para completar tu registro, por favor, haz clic en el siguiente enlace de verificación:</p>
          <a href="${confirmationLink}">Verificar Correo Electrónico</a>
          <p>Si no has solicitado este registro, por favor ignora este correo.</p>
          <p>Atentamente,<br>El equipo de Fit-Match</p>
        `,
      });

      res.status(200).json("Email enviado");
    } catch (error) {
      console.error('Error al enviar correo de confirmación', error);
      res.status(500).json(error);
      // Puedes lanzar el error o manejarlo de otra manera según tus necesidades.
    }
  }
  

  export {
    createVerificationToken,
    sendConfirmationMail,
    tokenIsValid
    
  }