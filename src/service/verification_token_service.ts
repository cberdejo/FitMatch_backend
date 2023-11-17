import db from "../database/database";


/**
 * Obtiene la información de verificación de un correo y su token.
 * @param emailToken - Token.
 * @param email - Correo.
 * @returns Promise con el mensaje de éxito.
 */
async function getVerificationTokenService(email:string, verificationToken:string){
    try{
        return db.verification_tokens.findFirst({
        where:{
            email: email,
            token: verificationToken,
            expiresAt: {
                
                gte: new Date(),
              },
        }
        }) ;

        
    }catch(error){
        console.error('Error al obtener token de verificacion de la base de datos', error);
        throw new Error('No se pudo obtener los token de verificacion');
        
    }
}



async function createVerificationTokenService(data:{token:string, email:string, expiresAt:Date}){
    try{
        return db.verification_tokens.create({
            data:{
                token: data.token,
                email: data.email,
                expiresAt: data.expiresAt,
               
            }
        })
    }catch(error){
        console.error('Error no se pudo crear el token de verificacion', error);
        throw new Error('No se pudo crear el token de verificacion');
        
    }
}

   export {
    createVerificationTokenService,
    getVerificationTokenService,
    
   }
  
  