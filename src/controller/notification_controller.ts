import { Request, Response } from 'express';
import { notificacionesService } from '../service/notificaciones_service';


export async function crearNotificaciones(req: Request, res: Response) {
  try {
    const { type, text, userIds } = req.body;
    const notificacion = await fetchCrearNotificaciones(type, text, userIds);
    if (!notificacion) {
      return res.status(500).json({ error: 'Error al procesar la notificación' });
    }

    return res.status(201).json(notificacion);
  } catch (error) {
    console.error('Error al crear notificaciones:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}

export async function readNotification(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await notificacionesService.readNotification(parseInt(id));
   
    return res.status(200).json({ message: 'Notificación leída' });
  } catch (error) {
    console.error('Error al leer notificaciones:', error);
    return res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}

export async function fetchCrearNotificaciones( type: string, text: string, userIds: number[]) {
  try {
    return await notificacionesService.crearNotificaciones( type, text, userIds);

  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
     throw error;
  }
}

// Controlador para obtener notificaciones por tipo
export async function obtenerNotificacionesPorTipo(req: Request, res: Response) {
    try {
      const { type } = req.params; // Asumiendo que el tipo se pasa como parámetro de la URL
      const notificaciones = await notificacionesService.obtenerNotificacionesPorTipo(type);
      return res.json(notificaciones);
    } catch (error) {
      console.error('Error al obtener notificaciones por tipo:', error);
      return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }
  
  // Controlador para obtener notificaciones por ID de usuario
  export async function obtenerNotificacionesPorUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params; // Asumiendo que el ID del usuario se pasa como parámetro de la URL
      const notificaciones = await notificacionesService.obtenerNotificacionesPorUsuario(parseInt(id));
      return res.json(notificaciones);
    } catch (error) {
      console.error('Error al obtener notificaciones por usuario:', error);
      return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }

