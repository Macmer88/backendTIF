import { pool } from '../config/db.js';

export async function salonesConFiltro(activo, ordenar, desc, limit, offset) {
    let query = 'SELECT * FROM salones WHERE activo = ?';
    const params = [activo];

    const columnasValidas = ['titulo', 'importe', 'capacidad'];
    if (ordenar && columnasValidas.includes(ordenar)) {
        query += ` ORDER BY ${ordenar}`;
        if (desc) query += ' DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function salonesPorId(id){
    const [rows] = await pool.query('SELECT * FROM salones WHERE salon_id = ?', [id]);
    return rows[0];
}
