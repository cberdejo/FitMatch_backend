import { Request, Response } from 'express';
import {
    getVerificationTokenService,
    createVerificationTokenService,
    
} from '../service/verification_token_service';

import { hashPassword } from '../config/crypting';
import transporter from "../config/mailer";  

import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';


 
  
  /**
   * Controlador para verificar el token de verificación.
   * @param req - Objeto de solicitud de Express.
   * @param res - Objeto de respuesta de Express.
   */
  async function tokenIsValid(req: Request, res: Response) {
    try {
      const { email, verificationToken } = req.body;
      if (!email) {
        return res.status(400).json({ status: 'error', data: 'Correo electrónico no especificado en la solicitud.' });
      }
      if (!verificationToken) {
        return res.status(400).json({ status: 'error', data: 'Token de verificación no especificado en la solicitud.' });
      }
      
      const verificationTokenObject = await getVerificationTokenService(verificationToken);
      if (verificationTokenObject) {
      
        const secret = process.env.JWT_SECRET || "b09a8dfac58621a5b742dd865e4c4c7782f8f5c9387ae9a0b3c13d87bbbc1e7f";
        const decodedToken: JwtPayload = jwt.verify(verificationToken, secret) as JwtPayload;
        console.log("decoded email:" + decodedToken.user_data.email);
        if (decodedToken.user_data.email !== email) {
          return res.status(401).json({ status: 'error', data: 'Token de verificación no encontrado' });
        } else{
          const currentTimestamp = Math.floor(Date.now() / 1000); // Fecha actual en segundos
          if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
            return res.status(401).json({ status: 'error', data: 'Token de verificación ha expirado' });
          } else {
            console.log(decodedToken);
            return res.status(200).json({ status: 'success', data: decodedToken });
          }

        }

      } else {
        return res.status(404).json({ status: 'error', data: 'Token de verificación no encontrado' });
      }
  
    } catch (error) {
      console.error('Error al obtener el estado de validación del token', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  

  
  
  async function createVerificationToken(req: Request, res: Response) {
    // EL TOKEN ESTÁ CIFRADO CON JWT, PERO LA CONTRASEÑA NO SE PASA PLANA, SE CIFRA PARA EXTRA SEGURIDAD
    try {
      const user_data: {
        username: string,
        email: string,
        password: string, 
        profile_picture: string,
        nacimiento: Date
        
      }  = req.body;

      const user_data_psw_cifrado = {
        username: user_data.username,
        email: user_data.email,
        password: hashPassword(user_data.password),
        profile_picture: user_data.profile_picture,
        nacimiento: user_data.nacimiento
      }
      

      
      console.log('Email:', user_data.email);

    
      const emailToken = jwt.sign({ user_data_psw_cifrado }, process.env.JWT_SECRET!, { expiresIn: '1h' });
          
      const tokenObject = {
        token: emailToken,
       
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
      if (!email) {
         res.status(400).json({ error: 'Correo electrónico no especificado en la solicitud.' });
      }
      if (!verificationToken) {
        res.status(400).json({ error: 'Token de verificación no especificado en la solicitud.' });
      }
      console.log('Email:', email);
      const confirmationLink = `${process.env.FRONTEND_URL}verificar?token=${verificationToken}&email=${email}`;
  
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
    tokenIsValid,

    
  }