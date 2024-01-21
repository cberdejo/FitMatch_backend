export function getPublicIdFromUrl(url: string) {
    if (!url) {
      throw new Error('URL is empty');
    }
  
    const urlParts = url.split('/');
    if (urlParts.length < 2) {
      throw new Error('URL does not contain enough parts to extract the public ID');
    }
  
    const lastPart = urlParts.pop(); // Obtener la última parte (nombre de archivo con extensión)

    if (!lastPart) {
      throw new Error('Unable to extract the public ID from the URL');
    }
  
    const fileName = lastPart.split('.')[0]; // Elimina la extensión del archivo
    return fileName; // Retorna solo el nombre del archivo, que es el ID público
}
