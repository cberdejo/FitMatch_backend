import { usuario } from "@prisma/client";
import db from "../config/database";




export const usuario_service = {
  /**
   * Crea un nuevo usuario en la base de datos.
   * @param data - Datos del usuario a crear.
   * @returns Promise con el nuevo usuario creado.
   */
  async  create(data: any) {
    try {
      return db.usuario.create({
        data: data,
      });
    } catch (error) {
      console.error('Error al crear usuario en la base de datos', error);
      throw new Error('No se pudo crear el usuario');
    }
  },

  
  /**
   * Obtiene todos los usuarios de la base de datos.
   * @returns Promise con la lista de usuarios.
   */
  async  getAll() {
    try {
      return db.usuario.findMany();
    } catch (error) {
      console.error('Error al obtener usuarios de la base de datos', error);
      throw new Error('No se pudieron obtener los usuarios');
    }
  },

  /**
   * Obtiene un usuario por su ID de la base de datos.
   * @param id - ID del usuario a buscar.
   * @returns Promise con el usuario encontrado.
   */
  async  getById(id: number): Promise<usuario | null > {
    try {
      return db.usuario.findUnique({
        where: {
          user_id: id,
        },
      });
    } catch (error) {
      console.error('Error al obtener usuario por ID de la base de datos', error);
      throw new Error('No se pudo obtener el usuario por ID');
    }
  },

  /**
   * Obtiene un usuario por su dirección de correo electrónico de la base de datos.
   * @param email - Dirección de correo electrónico del usuario a buscar.
   * @returns Promise con el usuario encontrado.
   */
  async  getByEmail(email: string) {
    try {
      return db.usuario.findUnique({
        where: {
          email: email,
        },
      });
    } catch (error) {
      console.error('Error al obtener usuario por correo electrónico de la base de datos', error);
      throw new Error('No se pudo obtener el usuario por correo electrónico');
    }
  },

  /**
   * Edita la información de un usuario en la base de datos.
   * @param data - Datos actualizados del usuario.
   * @returns Promise con el mensaje de éxito.
   */
  async  edit(data: any) {
    try {
      return db.usuario.update({
        where: {
          user_id: data.user_id,
        },
        data: data,
      });
    } catch (error) {
      console.error('Error al editar usuario en la base de datos', error);
      throw new Error('No se pudo editar el usuario');
    }
  },

  async getWeightSystemByUserId(userId: number): Promise<string> {
    try {
      const user = await this.getById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      } 
      return user.system
    } catch (error) {
      console.error('Error al obtener peso usuario en la base de datos', error);
      throw new Error('No se pudo editar el usuario');
    } finally {
      db.$disconnect();
    }
  }
}

