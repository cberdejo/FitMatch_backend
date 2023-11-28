

import * as crypto from 'crypto';
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
  
  export { checkPassword, hashPassword };