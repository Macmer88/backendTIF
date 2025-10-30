import { pool } from '../config/db.js';

export async function salonesConFiltro(activo, ordenar, desc, limit, offset) {
    let query = 'SELECT * FROM salones WHERE activo = ?';
    const params = [activo];

    const columnasValidas = ['salon_id','titulo', 'importe', 'capacidad'];
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


export async function updateSalon(id, datos) {
    const { titulo, direccion, capacidad, activo, importe } = datos;

    await pool.query(
        'UPDATE salones SET titulo = ?, direccion = ?, capacidad = ?, importe = ?, activo = ?, modificado = CURRENT_TIMESTAMP WHERE salon_id = ?',
        [titulo, direccion, capacidad, importe, activo, id]
    );
}


export async function deleteSalon(id){
    await pool.query('UPDATE salones SET activo = 0 WHERE salon_id=?', [id]);
} 

export async function reactivateSalon(id){
    await pool.query('UPDATE salones SET activo = 1 WHERE salon_id=?', [id]);
}


/*export async function buscarUltId() {
    const [rows] = await pool.query('SELECT salon_id FROM salones ORDER BY salon_id DESC LIMIT 1');
    return rows[0]?.salon_id || 0;
}*/ //No se usa porque el id es autoincremental

export async function createSalon(datos) {
    const {titulo, direccion, capacidad, importe } = datos;
    await pool.query(
        'INSERT INTO salones (titulo, direccion, capacidad, importe) VALUES (?, ?, ?, ?, ?)',
        [titulo, direccion, capacidad, importe]
    );
}

export async function buscarPorTitulo(nombre_salon){
    const [rows] = await pool.query('SELECT * FROM salones WHERE titulo = ? LIMIT 1', [nombre_salon]);
    return rows[0];
}

export async function buscarPorDireccion(direccion_salon){
    const [rows] = await pool.query('SELECT * FROM salones WHERE direccion = ? LIMIT 1', [direccion_salon]);
    return rows[0];
}