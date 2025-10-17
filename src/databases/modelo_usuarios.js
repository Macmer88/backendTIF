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
