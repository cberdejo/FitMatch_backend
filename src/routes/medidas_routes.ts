import express, { Router } from 'express';

    
import { upload } from '../config/cloudinary';
import { validateUserId } from '../validator/usuario_validators';
import { paramIdValidation } from '../validator/shared_validator';
import { createMedidas, deleteMedidas, getAllMedidas, updateMedidas } from '../controller/medidas_controller';


const medidasRouter: Router = express.Router();

medidasRouter.post ('/medidas', upload.array('pictures'), createMedidas );

medidasRouter.get('/medidas/:userId', validateUserId, getAllMedidas ); 
medidasRouter.delete('/medidas/:id', paramIdValidation, deleteMedidas );
medidasRouter.put('/medidas/:id', upload.array('pictures'), paramIdValidation, updateMedidas );

export default medidasRouter;