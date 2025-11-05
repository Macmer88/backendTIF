import { pool } from '../config/db.js';

export async function turnosConFiltro(activo, ordenar, desc, limit, offset) {
    let query = 'SELECT * FROM turnos WHERE activo = ?';
    const params = [activo];

    const columnasValidas = ['turno_id'];
    if (ordenar && columnasValidas.includes(ordenar)) {
        query += ` ORDER BY ${ordenar}`;
        if (desc) query += ' DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function turnosPorId(id){
    const [rows] = await pool.query('SELECT * FROM turnos WHERE turno_id = ?', [id]);
    return rows[0];
}


export async function updateTurno(id, datos) {
    const { hora_desde, hora_hasta } = datos;

    await pool.query(
        'UPDATE turnos SET hora_desde = ?, hora_hasta = ?, modificado = CURRENT_TIMESTAMP WHERE turno_id = ?',
        [hora_desde, hora_hasta, id]
    );
}


export async function deleteTurno(id){
    await pool.query('UPDATE turnos SET activo = 0 WHERE turno_id=?', [id]);
} 

export async function reactivateTurno(id){
    await pool.query('UPDATE turnos SET activo = 1 WHERE turno_id=?', [id]);
}



export async function createTurno(datos) {
    const {orden, hora_desde, hora_hasta } = datos;
    await pool.query(
        'INSERT INTO turnos (orden, hora_desde, hora_hasta) VALUES (?, ?, ?)',
        [orden, hora_desde, hora_hasta]
    );
}

export async function buscarTurnoPorOrden(orden) {
    const [rows] = await pool.query(
        'SELECT turno_id FROM turnos WHERE orden = ? AND activo = 1',
        [orden]
    );
    return rows[0];
}

export async function buscarTurnosSuperpuestos(hora_desde, hora_hasta, idAExcluir = null) {
    let query = `
        SELECT turno_id FROM turnos
        WHERE activo = 1
        AND (hora_desde < ?)
        AND (hora_hasta > ?)
    `;
    const params = [hora_hasta, hora_desde];

    if (idAExcluir) {
        query += ' AND turno_id != ?';
        params.push(idAExcluir);
    }

    const [rows] = await pool.query(query, params);
    return rows;
}