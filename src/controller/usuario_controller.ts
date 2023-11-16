import { Request, Response } from 'express';
import {
  createUsuarioService,
  getUsuariosByEmailService,
  editUsuarioService,
  getUsuariosService,
  getUsuarioByIdService,
  verifyEmailTokenService
} from '../service/usuario_service';

import { transporter } from '../config/mailer';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

/**
 * Crea un nuevo usuario.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */

async function createUsuario(req: Request, res: Response) {
  try {

   
    const { credentials, data} = req.body;
    
    //comprobar que los datos son correctos


    const  hashedPassword  = hashPassword(credentials.plainPassword);

    const nuevoUsuario = {
      email: credentials.email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString('hex'),
      ...data,
    };

    const usuario = await createUsuarioService(nuevoUsuario);

   
    res.status(201).json(usuario);
    console.log("usuario creado");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}



/**
 * Edita la información de un usuario.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function editUsuario(req: Request, res: Response) {
  try {
    const usuario = req.body; // Se pasa un usuario con una plainPassword
 
    const  hashedPassword  = hashPassword(usuario.password);

    const nuevoUsuario = {
      ...usuario,
      password: hashedPassword,
    };

    await editUsuarioService(nuevoUsuario);
    res.status(201).json({ message: 'Usuario editado' });
    console.log("usuario editado");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene la lista de todos los usuarios.
 * @param _req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function getUsuarios(_req: Request, res: Response) {
  try {
    const usuarios = await getUsuariosService();
    res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

// LOGIN
/**
 * Verifica las credenciales del usuario y emite un token JWT si las credenciales son válidas.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function verifyUsuarios(req: Request, res: Response) {
  try {
    const { email, plainPassword } = req.body;

    const user = await getUsuariosByEmailService(email);
    if (user === null) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    } else {
      const passwordMatches =  checkPassword(plainPassword, user.password);
      //CREAR LOGS Y BLOQUEOS DE IP DURANTE 5 MINUTOS PARA DETENER FUERZA BRUTA - PENDIENTE
      if (passwordMatches) {
        // Crea un token JWT con la clave secreta
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene un usuario por su ID.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function getUsuarioById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const usuario = await getUsuarioByIdService(id);
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).json(usuario); // Envía el usuario como respuesta JSON
    }
  } catch (error) {
    console.error('Error al obtener usuario ', error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene un usuario por su dirección de correo electrónico.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function getUsuarioByEmail(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const usuario = await getUsuariosByEmailService(email);
    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).json(usuario); // Envía el cliente como respuesta JSON
    }
  } catch (error) {
    console.error('Error al obtener usuario ', error);
    res.status(500).json(error);
  }
}

/**
 * Decodifica un token JWT y devuelve la información del usuario asociada.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function decodeToken(req: Request, res: Response) {
  try {
    const token = req.params.token;
    const secret = process.env.JWT_SECRET || "b09a8dfac58621a5b742dd865e4c4c7782f8f5c9387ae9a0b3c13d87bbbc1e7f";
    const decodedToken: JwtPayload = jwt.verify(token, secret) as JwtPayload;

    const userEmail = decodedToken.email;

    const user = await getUsuariosByEmailService(userEmail);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.status(200).json(user);
    }

  } catch (error) {
    console.error('Error al decodificar el token', error);
    res.status(500).json(error);
  }
}

async function verifyEmailToken(req: Request, res: Response) {
  try {
    const {emailToken, email} = req.body;
 
    if (!emailToken) {
      res.status(400).json({ error: 'Token de verificación no encontrado' }); 
    } 
    
    const user = await verifyEmailTokenService(emailToken, email);
    if (user) {
      res.status(200).json(user);
    }else{
      res.status(403).json({ error: 'Token de verificación incorrecto' });
    }

  }catch(error){
    console.error('Error al decodificar el token', error);
    res.status(500).json(error);
  }
}
/**
 * Envía un correo para verificar una cuenta.
 * @param email - Correo pendiente de verificar.
 */	
async function sendConfirmationMail(email: string, verificationToken: string) {
  try {
  
        await transporter.sendMail({
          from: process.env.MY_EMAIL,
          to: email,
          subject: 'Confirmación de Registro en Fit-Match',
          text: `
          <p>Estimado usuario de Google,</p>
          <p>Gracias por registrarte en Fit-Match. Para completar tu registro, por favor, introduce el siguiente código de verificación de 5 cifras en la página correspondiente:</p>
          <a href="${process.env.FRONTEND_URL}/verificar?token=${verificationToken}&email=${email}">Verificar Correo Electrónico</a>
          <p>Si no has solicitado este registro, por favor ignora este correo.</p>
          <p>Atentamente,<br>El equipo de Fit-Match</p>
        `
        });



  } catch (error) {
    console.error('Error al enviar correo', error);

  }
}

/**
 * Verifica si una contraseña coincide con una contraseña cifrada.
 *@param plainPassword - La contraseña sin cifrar.
 @param hashedPassword - La contraseña cifrada.
 * @returns True si la contraseña coincide, False de lo contrario.
 */
 function checkPassword(plainPassword: string, hashedPassword: string): boolean {
  const hashedPasswordInput = hashPassword(plainPassword);
  return hashedPassword === hashedPasswordInput;
}
/**
 * Cifra una contraseña usando sha 256.
 * @param password - La contraseña sin cifrar.
 * @returns La contraseña cifrada.
 */	
function hashPassword(password: string): string {
  const hash = crypto.createHmac('sha256', process.env.HASH_SECRET!);
  hash.update(password);
  return hash.digest('hex');
}


export {
  createUsuario,
  editUsuario,
  getUsuarioById,
  getUsuarioByEmail,
  getUsuarios,
  verifyUsuarios,
  decodeToken,
  verifyEmailToken
}
