import db from "../config/database";

/**
 * Crea un nuevo usuario en la base de datos.
 * @param data - Datos del usuario a crear.
 * @returns Promise con el nuevo usuario creado.
 */
async function createUsuarioService(data: any) {
  try {
    return db.usuario.create({
      data: data,
    });
  } catch (error) {
    console.error('Error al crear usuario en la base de datos', error);
    throw new Error('No se pudo crear el usuario');
  }
}

/**
 * Obtiene todos los usuarios de la base de datos.
 * @returns Promise con la lista de usuarios.
 */
async function getUsuariosService() {
  try {
    return db.usuario.findMany();
  } catch (error) {
    console.error('Error al obtener usuarios de la base de datos', error);
    throw new Error('No se pudieron obtener los usuarios');
  }
}

/**
 * Obtiene un usuario por su ID de la base de datos.
 * @param id - ID del usuario a buscar.
 * @returns Promise con el usuario encontrado.
 */
async function getUsuarioByIdService(id: number) {
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
}

/**
 * Obtiene un usuario por su dirección de correo electrónico de la base de datos.
 * @param email - Dirección de correo electrónico del usuario a buscar.
 * @returns Promise con el usuario encontrado.
 */
async function getUsuariosByEmailService(email: string) {
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
}

/**
 * Edita la información de un usuario en la base de datos.
 * @param data - Datos actualizados del usuario.
 * @returns Promise con el mensaje de éxito.
 */
async function editUsuarioService(data: any) {
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
}

/**
 * Retrieves a user by their client ID from the database.
 *
 * @param {number} clientId - The client ID of the user.
 * @return {Promise<object>} The user object if found.
 * @throws {Error} If the user is not found for the provided client ID.
 */
async function getUserByClientIdService(clientId: number) {
  try {
      const cliente = await db.clientes.findUnique({
          where: {
              client_id: clientId,
          },
          include: {
              usuario: true, // Asume que la relación se llama 'usuario'
          },
      });

      if (cliente && cliente.usuario) {
          return cliente.usuario;
      } else {
          throw new Error('Usuario no encontrado para el clientId proporcionado');
      }
  } catch (error) {
      console.error('Error al obtener usuario por ID de la base de datos', error);
      throw new Error('No se pudo obtener el usuario por ID');
  }
}

/**
 * Retrieves a client from the database based on the user ID.
 *
 * @param {number} userId - The ID of the user.
 * @return {Promise<object>} Returns a promise that resolves to the client object found in the database.
 * @throws {Error} Throws an error if the client could not be retrieved from the database.
 */
async function getClienteByUserIdService(userId: number) {
  try {
      return await db.clientes.findUnique({
          where: {
              user_id: userId,
          },
          
      });
    } catch (error) {
        console.error('Error al obtener cliente por ID de usuario de la base de datos', error);
        throw new Error('No se pudo obtener el cliente  por ID de usuario');
    }  
}

/**
 * Retrieves a trainer from the database by their trainer ID.
 *
 * @param {number} trainerId - The ID of the trainer to retrieve.
 * @return {Promise<object>} The trainer object matching the given ID.
 */
async function getTrainerByTrainerIdService(trainerId: number) {
  try {
      return await db.entrenadores.findUnique({
          where: {
              trainer_id: trainerId,
          },
          
      });
    } catch (error) {
        console.error('Error al obtener trainer por ID', error);
        throw new Error('No se pudo obtener el trainer  por ID ');
    }  
}




export {
  createUsuarioService,
  getUsuariosByEmailService,
  editUsuarioService,
  getUsuariosService,
  getUsuarioByIdService,
  getUserByClientIdService,
  getClienteByUserIdService,
  getTrainerByTrainerIdService

};
