import { Request, Response, NextFunction } from 'express';
import { emparejamientoInsert } from '../interfaces/usuarios_interfaces';


/**
 * Validates the request body for creating a new user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function to be called.
 * @return {Promise<void>} - This function does not return anything.
 */
async function validateCreateUsuario(req: Request, res: Response, next: NextFunction){
    const { username, email, password, profile_id, birth } = req.body;
    const profile_picture = req.file;

    if (!username || !email || !password || !profile_id || !birth || !profile_picture ) {
        return res.status(400).json({ error: 'Datos incompletos o incorrectos' });
    }
    
  
    //aquí podría comprobar si el email sigue un formato correcto, longitud de password, ...
    /* expresión regular para email
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return res.status(400).json({ error: 'Email inválido' });
    }*/

   
    return next();
}



async function validateEditUsuario(_req: Request, _res: Response, next: NextFunction): Promise<void> {
    
  
   //terminar
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
 * Validates the given ID from the request parameters.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} - Returns nothing.
 */
async function validateGetUsuarioById(req: Request, res: Response, next: NextFunction){
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
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
    validateCreateUsuario,
    validateEditUsuario,
    validateVerifyUsuarios,
    validateGetUsuarioById,
    validateGetUsuarioByEmail
    
}
