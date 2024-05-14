import { usuario } from "@prisma/client";
import db from "../config/database";




export  const usuario_service = {
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
  async  getAll( page:number = 1, pageSize:number = 100) {

    try {
       
      const offset = (page - 1) * pageSize;
      return db.usuario.findMany({
        skip: offset,
        take: pageSize
      }, );
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
  
async edit(data: {
  user_id: number;
  username?: string;
  email?: string;
  password?: string;
  profile_picture?: string;
  birth?: Date;
  bio?: string;
  public?: boolean;
  system?: string;
  profile_id?: number;
}) {
  try {
    const { user_id, ...updateData } = data; 

    // Filtrar propiedades indefinidas o nulas
    const filteredData = Object.entries(updateData).reduce((acc: { [key: string]: any }, [key, value]) => {
      if (value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (Object.keys(filteredData).length === 0) {
      throw new Error('No se proporcionaron datos para actualizar');
    }

    // Asegurarse de que user_id esté definido para la cláusula where
    if (!user_id) {
      throw new Error('El user_id es necesario para realizar la actualización');
    }

    return await db.usuario.update({
      where: { user_id },
      data: filteredData,
    });
  } catch (error) {
    console.error('Error al editar usuario en la base de datos', error);
    throw new Error('No se pudo editar el usuario');
  }
},

async toggleBanUser(userId: number) {
  const user = await this.getById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  const banned:boolean = user.banned ? false : true;
  return db.usuario.update({
    where: { user_id: userId },
    data: { banned: banned },
  });
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

export const otpService = {

  async createOtp(value:string ) {
    try {
      const fechaActual = new Date();
      // 3600000 milisegundos = 1 hora
      const fechaCaducado = new Date(fechaActual.getTime() + 3600000);
  
      // Crear el OTP en la base de datos con la fecha de caducidad
      return await db.codigo_otp.create({
        data: { 
          valor: value,
          fecha_caducado: fechaCaducado
         },
      });
    } catch (error) {
      console.error('Error al crear OTP en la base de datos', error);
      throw new Error('No se pudo crear el OTP');
    }
  }, 
  async getOTPByValue(value: string) {
    try {
      return await db.codigo_otp.findUnique({
        where: { valor: value },
      });
    } catch (error) {
      console.error('Error al obtener OTP por valor de la base de datos', error);
      throw new Error('No se pudo obtener el OTP');
    }
  },
 async delete(otpId: number) {
    try {
      return await db.codigo_otp.delete({
        where: { id: otpId },
      });
    } catch (error) {
      console.error('Error al finalizar OTP en la base de datos', error);
      throw new Error('No se pudo finalizar el OTP');
    }
  }
}

