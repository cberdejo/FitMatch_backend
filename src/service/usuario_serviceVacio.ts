import db from "../database/database";

function createUsuarioService(_data:any) {}
function getUsuariosByEmailService(_data:any) {
    return {
        email: 'email',
        password: 'password',
    }
}
function editUsuarioService(_data:any) {}
 function getUsuariosService() {
    return  db.usuario.findMany();
}
 function getUsuarioByIdService(_data:any) {
    return {
        email: 'email',
        password: 'password',
    }
}

export {
    createUsuarioService,
    getUsuariosByEmailService,
    editUsuarioService,
    getUsuariosService,
    getUsuarioByIdService,
  };
  