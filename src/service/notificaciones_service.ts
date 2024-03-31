import db  from "../config/database";

export const notificacionesService = {
    crearNotificaciones : async ( type: string, text: string, userIds: number[]) => {
       try {
        const creaciones = userIds.map(userId => ({
            user_id: userId,
            type,
            mensaje: text,
            read: false, // Asumiendo valores por defecto
            // Agrega cualquier otro campo requerido por tu modelo
          }));

          return await db.notificacion.createMany({
            data: creaciones,
          });

       } catch (error) {
           console.error(error);
           throw new Error('Ocurrio un error al procesar la notificación');
       }  
    },

    obtenerNotificacionesPorTipo: async (type: string) => {
        try {
          return await db.notificacion.findMany({
            where: { type },
            orderBy: { timestamp: 'desc' },
            take: 30
          });
        } catch (error) {
          console.error('Error al obtener notificaciones por tipo:', error);
          throw new Error('Ocurrió un error al procesar la solicitud');
        }
      },
    
      // Método nuevo para obtener notificaciones por ID de usuario
      obtenerNotificacionesPorUsuario: async (userId: number) => {
        try {
          return await db.notificacion.findMany({
            where: { user_id: userId },
            orderBy: { timestamp: 'desc' },
            take: 30

          });
        } catch (error) {
          console.error('Error al obtener notificaciones por usuario:', error);
          throw new Error('Ocurrió un error al procesar la solicitud');
        }
      },

      async readNotification(userId: number) {
        try {
          await db.notificacion.updateMany({
            where: { user_id: userId, read: false },
            data: { read: true },
          });
        } catch (error) {
          console.error('Error al marcar notificaciones como leidas:', error);
          throw new Error('Ocurrio un error al procesar la notificación');
        }
      }
}