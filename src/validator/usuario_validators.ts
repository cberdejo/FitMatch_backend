import { Request, Response, NextFunction } from 'express';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';
import { usuario_service } from '../service/usuario_service';



async function validateUserId(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId);
    if (!esNumeroValido(userId)) {
        return res.status(400).json({ error: 'El id es obligatorio y debe ser un número más pequeño.' });
    } 
    const user = await usuario_service.getById(userId);
    if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado.' });
    }
    return next();
}
/**
 * Validates the request body for creating a new user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {Promise<void>} - This function does not return anything.
 */
async function validateCreateUsuario(req: Request, res: Response, next: NextFunction) {
    const { username, email, password, profile_id, birth } = req.body;
    //const profile_picture = req.file;

    // Validar campos obligatorios
    if (!username || !email || !password || !profile_id) {
        return res.status(400).json({ error: 'Datos obligatorios incompletos o incorrectos' });
    }

    // Validación de Email
    
    if (profile_id != 1 &&!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        console.error('Email inválido');
        return res.status(400).json({ error: 'Email inválido' });
    }

    // Validación de Fecha de Nacimiento (si se proporciona)
    if (birth) {
        const birthDate = new Date(birth);
        const currentDate = new Date();

        if (isNaN(birthDate.getTime())) {
             console.error('Fecha de nacimiento inválida');
            return res.status(400).json({ error: 'Fecha de nacimiento inválida' });
        }

        if (birthDate > currentDate || new Date(birthDate.getFullYear() + 120, birthDate.getMonth(), birthDate.getDate()) < currentDate) {
            console.error('Fecha de nacimiento no razonable');
            return res.status(400).json({ error: 'Fecha de nacimiento no razonable' });
        }
    }

    // Validación perfil
    const profile = parseInt(profile_id);
    if (isNaN(profile) || profile < 0) {
        console.error('Perfil inválido');
        return res.status(400).json({ error: 'Perfil inválido' });
    }


  

    return next();
}




async function validateEditUsuario(_req: Request, _res: Response, next: NextFunction): Promise<void> {
  
    return next();
}



/**
 * Validates the given user's email and password.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} - Returns a promise that resolves with void.
 */
async function validateVerifyUsuarios(req: Request, res: Response, next: NextFunction){
    const { email, plainPassword } = req.body;

    if (!email || !plainPassword) {
        return res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    }else{
        return next();
    }
  
   
}





/**
 * Validates the email parameter received in the request and checks if it is valid.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @return {Promise<void>} - The promise that resolves to nothing.
 */
async function validateGetUsuarioByEmail(req: Request, res: Response, next: NextFunction) {
    const email = req.params.email;
    if (!email) {
        return res.status(400).json({ error: 'Email inválido' });
    }else{
        return next();

    }
}
   


export {
    validateUserId,
    validateCreateUsuario,
    validateEditUsuario,
    validateVerifyUsuarios,
    validateGetUsuarioByEmail
    
}
