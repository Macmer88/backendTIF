import { pool } from "../config/db.js";

export async function usuariosConFiltro(activo, ordenar, desc, limit, offset) {
    let query = 'SELECT * FROM usuarios WHERE activo = ?';
    const params = [activo];

    const columnasValidas = ['usuario_id', 'nombre', 'apellido', 'tipo_usuario'];
    if (ordenar && columnasValidas.includes(ordenar)) {
        query += ` ORDER BY ${ordenar}`;
        if (desc) query += ' DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function usuariosPorId(id){
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE usuario_id = ?', [id]);
    return rows[0];
}

export async function eliminarUsuario(id){
    const [rows] = await pool.query('UPDATE usuarios SET activo = 0 WHERE usuario_id = ?', [id]);
    return rows[0];
}

export async function reactivarUsuario(id){
    const [rows] = await pool.query('UPDATE usuarios SET activo = 1 WHERE usuario_id = ?', [id]);
    return rows[0];
}

export async function actualizarUsuario(id, datos){
    const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular } = datos;
        await pool.query(`UPDATE usuarios SET nombre = ?, apellido = ?, nombre_usuario = ?, contrasenia = ?, tipo_usuario = ?, celular = ? WHERE usuario_id = ?`,
        [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, id]);
    return datos;
}

export async function crearUsuario(datos){
    const {nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto } = datos;
    await pool.query(
        `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, nombre_usuario, contrasenia, tipo_usuario, celular, foto]
    );
    return {datos };
}

export async function actualizar(usuario_id, datosParaActualizar) {
    const nuevoNombreFoto = datosParaActualizar.foto;
    const [resultado] = await pool.query(
        'UPDATE usuarios SET foto = ? WHERE usuario_id = ?',
        [nuevoNombreFoto, usuario_id]
    );
    return resultado;
}