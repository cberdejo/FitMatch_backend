import express, { Router } from 'express';

import {  createVerificationToken, tokenIsValid, sendConfirmationMail} from '../controller/verification_token_controller';
const verificationTokenRouter: Router = express.Router();

verificationTokenRouter.post('/sendConfirmation', sendConfirmationMail);
verificationTokenRouter.post('/verificationToken', createVerificationToken);
verificationTokenRouter.post('/isVerified', tokenIsValid);


export default verificationTokenRouter;