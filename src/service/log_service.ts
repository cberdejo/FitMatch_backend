
import db  from "../config/database";



/**
 * Publica una entrada de logs en la base de datos.
 * @param log - La información del log, incluyendo el correo electrónico, el estado de éxito y la dirección IP.
 * @returns Una Promesa que se resuelve con la entrada de registro creada.
 */

function postLogService(log: { email: string, exito: boolean, ip_address: string }){
    try{
        return db.logs.create({
            data: {
              email: log.email,
              exito: log.exito,
              ip_address: log.ip_address,
            }
          })
    }catch(error){
        console.error('Error al crear el log:', error);
        throw error;
    }
}

/**
 * Obtiene logs de la base de datos, ordenados por fecha en orden descendente.
 * @returns Una Promesa que se resuelve con un array de entradas de registro.
 */

function verLogsService( ip_filtro?: string, page: number = 1, pageSize: number = 10){
    try{
      const where = ip_filtro ? { ip_address: ip_filtro } : {};

        const offset = (page - 1) * pageSize;

        return db.logs.findMany({
          where: where, 
          orderBy: {
                fecha: 'desc', 
            },
            skip: offset,
            take: pageSize
        });

    }catch(error){
        console.error('Error al obtener logs:', error);
        throw error;
    }
}

/**
 * Obtiene  entradas de bloqueos de la base de datos según la dirección IP que sean mas reciente de x minutos .
 * @param ip_address - La dirección IP a buscar.
 * @returns Una Promesa que se resuelve con la entrada de bloqueo o null si no se encuentra.
 */
function getBloqueoByIPService(ip_address: string){


  try{
    return db.bloqueos.findFirst({
      where: {
        ip_address: ip_address,
        fecha_hasta: {
          gte: new Date(),
        },
      },
    });
  }catch(error){
    console.error('Error al obtener logs:', error);
    throw error;
  }
}

/**
 * Crea una entrada de bloqueo en la base de datos.
 * @param ip_address - La dirección IP que se va a bloquear.
 * @returns Una Promesa que se resuelve con la entrada de bloqueo creada.
 */
function createBloqueo( ip_address: string, fecha: Date){
    try{
        return db.bloqueos.create({
            data: {
              ip_address: ip_address,
              fecha_hasta: fecha,
            }
          })
    }catch(error){
        console.error('Error al crear el log:', error);
        throw error;
    }
}



/**
 * Cuenta el número de intentos de inicio de sesión fallidos por dirección IP en los últimos x minutos.
 * @param ip_address - La dirección IP para comprobar los intentos de inicio de sesión fallidos.
 * @returns Una Promesa que se resuelve con el recuento de intentos de inicio de sesión fallidos.
 */
function countFailedLoginAttemptsByIp(ip_address: string){
  const minutesBloqueados = parseInt(process.env.MINUTOS_CONTAR_BLOQUEO || '1', 100);

  const minutesAgo = new Date();
  minutesAgo.setMinutes(minutesAgo.getMinutes() - minutesBloqueados);

    try{
        return db.logs.count({
            where: {
              exito: false,
              ip_address: ip_address,
              fecha: {
                gte: minutesAgo,
              }
            }
          })
    }catch(error){
        console.error('Error al crear el log:', error);
        throw error;
    }
}

function getBloqueosService( ip_filtro?: string, page: number = 1, pageSize: number = 100){
  try{
    const where = ip_filtro ? { ip_address: ip_filtro } : {};
    const offset = (page - 1) * pageSize;

    return db.bloqueos.findMany(
      {
        where: where,
        orderBy: {
          fecha_hasta: 'desc',
        },
        skip: offset,
        take: pageSize
      }
    );
  } catch(error){
    console.error('Error al obtener logs:', error);
    throw error;
  }
}

export {
    postLogService, 
    verLogsService,
    getBloqueoByIPService,
    createBloqueo,
    countFailedLoginAttemptsByIp,
    getBloqueosService
}