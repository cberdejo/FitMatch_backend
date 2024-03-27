import { Request, Response } from 'express';
import {
  otpService,
  usuario_service
} from '../service/usuario_service';

import { checkPassword, hashPassword } from '../config/crypting';

import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { deleteImageFromCloudinary, postImage } from '../config/cloudinary';
import { getPublicIdFromUrl } from '../utils/funciones_auxiliares_controller';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';
import { codigo_otp } from '@prisma/client';
import { sendOTPMessage } from '../config/mailer';



/**
 * Crea un nuevo usuario.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */

async function createUsuario(req: Request, res: Response) {
  try {
      const { username, email, password, profile_id, birth } = req.body;
      const profile_picture = req.file;

      let cloudinary_profile_picture;
      if (profile_picture) {
          cloudinary_profile_picture = await postImage(profile_picture);
      }

      const crypt_data = {
          username: username,
          email: email,
          profile_picture: cloudinary_profile_picture || null,
          birth: birth ? new Date(birth) : null,
          profile_id: parseInt(profile_id),
          password: hashPassword(password),
      };

      const usuario = await usuario_service.create(crypt_data);
      res.status(201).json(usuario);
  } catch (error) {
      console.log(error);
      res.status(500).json({ error });
  }
}



async function getUsuarioToken(req: Request, res: Response) {
  try {
    const id:number = parseInt(req.params.id);

    const user = await usuario_service.getById(id);

    if (user === null) {
      res.status(401).json({ message: 'usuario no exite' });
    } else {
      
        // Crea un token JWT con la clave secreta+
        let token =  jwt.sign({ user: user }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        token =  jwt.sign({ user: user }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        
        res.status(200).json({ token });
      } 
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}




/**
 * Edita la información de un usuario.
 * @param req - Objeto de solicitud de Express.
 * @param res - Objeto de respuesta de Express.
 */
async function editUsuario(req: Request, res: Response) {
  try {
    const user_id = parseInt(req.params.id); 
    const { username, email, password, profile_id, birth, bio, isPublic, system } = req.body;
    const profile_picture = req.file;
    const existingUser = await usuario_service.getById(user_id);
    if (!existingUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    let cloudinary_profile_picture;
    if (existingUser.profile_picture && profile_picture) {
      // Obtener el ID público de la imagen existente
      const publicImageId = getPublicIdFromUrl(existingUser.profile_picture);

      // Eliminar la imagen existente
    
      await deleteImageFromCloudinary(publicImageId);

      // Subir la nueva imagen
      cloudinary_profile_picture = await postImage(profile_picture);
    } else if (profile_picture) {
        // No hay imagen existente, pero hay una nueva imagen para subir
        cloudinary_profile_picture = await postImage(profile_picture);
    } else {
        // Mantener la imagen actual si no hay una nueva imagen
        cloudinary_profile_picture = existingUser.profile_picture;
    }
      console.log (password);

      // Comprobar todos los parámetros y enviar undefined si son nulos o iguales a los valores existentes
      const dataToEdit = {
        user_id,
        username: (username !== null && username !== existingUser.username) ? username : undefined,
        email: (email !== null && email !== existingUser.email) ? email : undefined,
        password: (password !== null && password != "") ? hashPassword(password) : undefined,
        profile_picture: (cloudinary_profile_picture !== null && cloudinary_profile_picture !== existingUser.profile_picture) ? cloudinary_profile_picture : undefined,
        birth: (birth !== null && !isNaN(new Date(birth).getTime()) ) ? new Date(birth) : undefined,
        bio: (bio !== null && bio!= "" && bio !== existingUser.bio) ? bio : undefined,
        public: (isPublic !== null && isPublic !== existingUser.public) ? ((isPublic === 'true') ? true : false ) : undefined,
        system: (system !== null && system !== existingUser.system) ? system : undefined,
        profile_id: (profile_id !== null && esNumeroValido(profile_id) && profile_id !== existingUser.profile_id)  ? parseInt(profile_id) : undefined,
      };
  
      const user = await usuario_service.edit(dataToEdit);
      console.log(user);
      res.status(201).json(user);
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
    const usuarios = await usuario_service.getAll();
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

    const user = await usuario_service.getByEmail(email);
    if (user === null) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    } else {
      const passwordMatches = checkPassword(plainPassword, user.password);
      //CREAR LOGS Y BLOQUEOS DE IP DURANTE 5 MINUTOS PARA DETENER FUERZA BRUTA - PENDIENTE
      if (passwordMatches) {
        // Crea un nuevo objeto sin la contraseña
        const userWithoutPassword = { ...user, password: undefined };

        let token = jwt.sign({ user: userWithoutPassword }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        console.log(userWithoutPassword); // Asegúrate de que no incluya la contraseña
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
    const usuario = await usuario_service.getById(id);
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
    const usuario = await usuario_service.getByEmail(email);
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

    const user = await usuario_service.getByEmail(userEmail);

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

async function checkOtp(req: Request, res: Response) {
  try {
    const otp = req.body.otp;
    if (!otp) {
      console.error ('Otp no recibido');
      return res.status(400).json({ error: 'Otp no recibido' });
    }
    const otpObject: codigo_otp | null = await otpService.getOTPByValue(otp);

    if (!otpObject) {
      return res.status(400).json({ error: 'Otp no encontrado' });
    }

    if (otpObject.fecha_caducado < new Date()) {
      return res.status(400).json({ error: 'Otp expirado' });
    }

    otpService.delete(otpObject.id);
    return res.status(200).json({ message: 'Otp correcto' });

  } catch (error) {
    console.error('Error al verificar el OTP', error);
    return res.status(500).json({ message: 'Error interno del servidor', error:error });
  }
}


async function sendOtp(req: Request, res: Response) {
  try {
    const mail = req.body.mail;
    if (!mail) {
      console.error ('Mail no recibido');
      return res.status(400).json({ error: 'mail no recibido' });
    }
    const newOtp:string = await generateOTP();
    // Enviar correo
    await sendOTPMessage(mail, newOtp); // Asumiendo que sendOTPMessage sea asíncrono

    return res.status(200).json({ message: 'Otp enviado' });
  } catch (error) {
    console.error('Error al enviar OTP', error);
    return res.status(500).json(error); // Asegúrate de retornar también en el catch
  }
}


async function generateOTP(): Promise<string> {
  // Genera un código OTP de 6 dígitos
  const otp = Math.floor(100000 + Math.random() * 900000);
  const otpObject: codigo_otp|null = await otpService.getOTPByValue(otp.toString());
  if (otpObject) { 
    return  generateOTP(); //en caso de existir, probaría a generar otro
  }

  otpService.createOtp(otp.toString()); //se inserta en la base de datos
  return otp.toString();
}




export {
  createUsuario,
  editUsuario,
  getUsuarioById,
  getUsuarioByEmail,
  getUsuarios,
  verifyUsuarios,
  decodeToken,
  getUsuarioToken,
  checkOtp,
  sendOtp
}
