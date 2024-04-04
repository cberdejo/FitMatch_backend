import { Request, Response, NextFunction } from 'express';
import { esNumeroValido } from '../utils/funciones_auxiliares_validator';
import { usuario_service } from '../service/usuario_service';

 export async function validatePermisos(req: Request, res: Response, next: NextFunction) {
     const userId = req.params.id;
     if (!esNumeroValido(userId)) {
         res.status(400).json({ error: 'userId no válido' });
         return;
     }
     const user = await usuario_service.getById(parseInt(userId));
     if (!user) {
         res.status(400).json({ error: 'Usuario no encontrado' });
         return;
     }
     if (user.profile_id != 1) {
         res.status(400).json({ error: 'No tienes permisos para realizar esta acción' });
         return;
     }
     next();
 }