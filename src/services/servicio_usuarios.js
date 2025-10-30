
import * as modeloUsuarios from '../databases/modelo_usuarios.js';
import { deleteImage } from '../utils/fileutils.js';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

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

export async function deleteUsuario(id) {
    const usuario = await modeloUsuarios.usuariosPorId(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    if (usuario.activo !== 1) {
        return { mensaje: 'El usuario ya está inactivo', usuario_id: usuario.usuario_id };
    }
    await modeloUsuarios.eliminarUsuario(id);
    return { mensaje: 'Usuario eliminado', usuario_id: id };
}

export async function reactivateUsuario(id) {  
    const usuario = await modeloUsuarios.usuariosPorId(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    if (usuario.activo === 1) {
        return { mensaje: 'El usuario ya está activo', usuario_id: usuario.usuario_id };
    }
    await modeloUsuarios.reactivarUsuario(id);
    return { mensaje: 'Usuario reactivado', usuario_id: id };
}

export async function updateUsuario(id, datos) {
    const { nombre, apellido, tipo_usuario, celular } = datos;

    if (    nombre === undefined ||
            apellido === undefined ||
            tipo_usuario === undefined ||
            celular === undefined) {
        throw new Error("Faltan campos obligatorios");
    }
    const name = datos.nombre.toLowerCase();
    const surname = datos.apellido.toLowerCase();
    const nombre_usuario = name.slice(0, 3)+ surname.slice(0, 3)+ '@correo.com';
    
    await modeloUsuarios.actualizarUsuario(id, { nombre, apellido, nombre_usuario, tipo_usuario, celular });
    console.log('Usuario actualizado:', { nombre, apellido, nombre_usuario, tipo_usuario, celular });
    return { mensaje: 'Usuario actualizado', usuario_id: id };
}

export async function createUser(datos) {
    const { nombre, apellido, contrasenia, tipo_usuario, celular, foto } = datos;

    // 1. Hasheamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseniaHasheada = await bcrypt.hash(contrasenia, salt);

    // 2. Lógica de nombre_usuario
    const name = nombre.toLowerCase();
    const surname = apellido.toLowerCase();
    let baseUsuario = name.slice(0, 3) + surname.slice(0, 3) + '@correo.com'; 
    let nombre_usuario = baseUsuario; 
    let contador = 1;

    // Verificamos si ya existe
    let usuarioExistente = await modeloUsuarios.buscarPorNombreUsuario(nombre_usuario);

    // Si existe, añadimos un número y volvemos a verificar, hasta encontrar uno libre
    while (usuarioExistente) {
        const nombreBaseSinDominio = baseUsuario.split('@')[0];
        nombre_usuario = `${nombreBaseSinDominio}${contador}@correo.com`;
        usuarioExistente = await modeloUsuarios.buscarPorNombreUsuario(nombre_usuario);
        contador++;
    }

    // 3. Enviamos la contraseña hasheada al DAO
    await modeloUsuarios.crearUsuario({ 
        nombre, 
        apellido, 
        nombre_usuario, 
        contrasenia: contraseniaHasheada, // <-- Se envía la versión encriptada
        tipo_usuario, 
        celular, 
        foto 
    });
    
    console.log('Usuario creado:', { datos});
    return { mensaje: 'Usuario creado', nombre_usuario };
}

export const cambiarFoto = async (id, nuevoArchivo) => { 
    const idNumerico = parseInt(id, 10);

    const usuario = await modeloUsuarios.usuariosPorId(idNumerico);
    if (!usuario) {
        throw createError(404, 'El usuario no fue encontrado.');
    }

    const fotoAntigua = usuario.foto;
    const datosParaActualizar = { foto: nuevoArchivo.filename };

    const usuarioActualizado = await modeloUsuarios.actualizar(idNumerico, datosParaActualizar);

    await deleteImage(fotoAntigua);
    return usuarioActualizado;
};