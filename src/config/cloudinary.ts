import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET='wITq2WhgdebKuvyHtS1EfRzgqks' || '',
});

export async function postImage(file: any) {
    try {
     
    
      const imageBuffer = file.buffer.toString('base64');
      const imageUrl = `data:image/jpeg;base64,${imageBuffer}`;
  
      // Subir la imagen a Cloudinary
      const result = await cloudinary.uploader.upload(imageUrl);
  
      // Verificar si Cloudinary devolvió un resultado
      if (result.error) {
        throw new Error(`Error al cargar la imagen a Cloudinary: ${result.error.message}`);
      }
      
      const imageUrlFromCloudinary = result.secure_url;
  
      return   imageUrlFromCloudinary ;
    } catch (error) {
      console.error('Error en la carga de la imagen:', error);
      throw error;
    }
  }
  export async function deleteImageFromCloudinary(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(result); // Puedes verificar la respuesta para confirmar la eliminación
    } catch (error) {
      console.error('Error al eliminar la imagen de Cloudinary:', error);
      throw error; // Lanza el error para manejarlo más adelante
    }
  }
// Configura el almacenamiento de Multer
const storage = multer.memoryStorage(); // Almacena el archivo en la memoria, útil si luego quieres subirlo a otro servicio como Cloudinary

// Configura las opciones de Multer, como el tamaño máximo del archivo
export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limita el tamaño del archivo a 5MB
    // Aquí puedes añadir más configuraciones, como filtro de tipos de archivos
});

