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
 * Creates a new set of etiquetas in the database.
 *
 * @param {emparejamientoInsert[]} emparejamientos - An array of emparejamiento objects to be inserted.
 * @param {number} user_id - The ID of the user associated with the emparejamientos.
 * @return {Promise<any>} A promise that resolves to the result of the database operation.
 */
/*
async function assiganEtiquetasService(emparejamientos: emparejamientoInsert[], user_id: number) {
  try {
    const emparejamientosData = emparejamientos.map(emparejamiento => ({
      ...emparejamiento,
      user_id: user_id
    }));

    return db.etiquetas.createMany({
      data: emparejamientosData,
    });
  } catch (error) {
    console.error('Error al crear emparejamientos en la base de datos', error);
    throw new Error('No se pudo crear el emparejamientos');
  }
}
*/
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




export {
  createUsuarioService,
  getUsuariosByEmailService,
  editUsuarioService,
  getUsuariosService,
  getUsuarioByIdService,

};
