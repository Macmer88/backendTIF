import * as modeloUsuarios from '../databases/modelo_usuarios.js';

export async function fetchUsuarios(activo, ordenar, desc, limit, offset) {
    return await modeloUsuarios.usuariosConFiltro(activo, ordenar, desc, limit, offset);
}

export async function fetchUsuarioById(id) {
    const usuario = await modeloUsuarios.usuariosPorId(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    if (usuario.activo !== 1) {
        return {
            mensaje: 'Usuario inactivo',
            usuario_id: usuario.usuario_id,
            nombre: usuario.nombre,
            estado: 'inactivo'
        };
    }
    return { mensaje: 'Usuario activo', usuario };
}