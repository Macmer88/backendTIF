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

export async function updateSalon(id, { titulo, direccion, capacidad, activo, importe }) {
    if (
        titulo === undefined ||
        direccion === undefined ||
        capacidad === undefined ||
        activo === undefined ||
        importe === undefined
    ) {
        throw new Error("Faltan campos obligatorios para actualizar");
    }

    await pool.query(
        'UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ?, activo = ?, modificado = CURRENT_TIMESTAMP WHERE salon_id = ?',
        [titulo, direccion, capacidad, importe, parseInt(activo), id]
    );
}