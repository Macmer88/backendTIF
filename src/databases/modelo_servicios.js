import { pool } from '../config/db.js';

export async function serviciosConFiltro(activo, ordenar, desc, limit, offset, buscar) {
    let query = 'SELECT * FROM servicios WHERE activo = ?';
    const params = [activo];

    const columnasValidas = ['servicio_id','descripcion', 'importe'];
    if (ordenar && columnasValidas.includes(ordenar)) {
        query += ` ORDER BY ${ordenar}`;
        if (desc) query += ' DESC';
    }

    if (buscar) {
        query += ' AND descripcion LIKE ?';
        params.push(`%${buscar}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function serviciosPorId(id){
    const [rows] = await pool.query('SELECT * FROM servicios WHERE servicio_id = ?', [id]);
    return rows[0];
}


export async function updateServicio(id, datos) {
    const { descripcion, importe } = datos;

    await pool.query(
        'UPDATE servicios SET descripcion = ?, importe = ?, modificado = CURRENT_TIMESTAMP WHERE servicio_id = ?',
        [descripcion, importe, id]
    );
}


export async function deleteServicio(id){
    await pool.query('UPDATE servicios SET activo = 0 WHERE servicio_id=?', [id]);
} 

export async function reactivateServicio(id){
    await pool.query('UPDATE servicios SET activo = 1 WHERE servicio_id=?', [id]);
}



export async function createServicio(datos) {
    const {descripcion, importe } = datos;
    await pool.query(
        'INSERT INTO servicios (descripcion, importe) VALUES (?, ?)',
        [descripcion, importe]
    );
}


