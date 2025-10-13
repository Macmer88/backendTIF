import { pool } from '../config/db.js';

export async function reservasConFiltro(activo, ordenar, desc, limit, offset) {
    let query = 'SELECT * FROM reservas WHERE activo = ?';
    const params = [activo];

    const columnasValidas = ['reserva_id', 'importe_salon', 'fecha_reserva', 'creado', 'importe_total'];
    if (ordenar && columnasValidas.includes(ordenar)) {
        query += ` ORDER BY ${ordenar}`;
        if (desc) query += ' DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function reservasPorId(id){
    const [rows] = await pool.query('SELECT * FROM reservas WHERE reserva_id = ?', [id]);
    return rows[0];
}


export async function updateReservas(id, datos) {
    const { fecha_reserva, salon_id, turno_id,  importe_total } = datos;

    await pool.query(
        'UPDATE reservas SET fecha_reserva = ?, salon_id = ?, turno_id = ?, importe_total = ?, modificado = CURRENT_TIMESTAMP WHERE reserva_id = ?',
        [fecha_reserva, salon_id, turno_id, importe_total, id]
    );
}


export async function deleteReserva(id){
    await pool.query('UPDATE reservas SET activo = 0 WHERE reserva_id=?', [id]);
} 

export async function reactivateReserva(id){
    await pool.query('UPDATE reservas SET activo = 1 WHERE reserva_id=?', [id]);
}


export async function buscarUltId() {
    const [rows] = await pool.query('SELECT reserva_id FROM reservas ORDER BY reserva_id DESC LIMIT 1');
    return rows[0]?.reserva_id || 0;
}

export async function createReserva(datos) {
    const { reserva_id, fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total } = datos;
    await pool.query(
        'INSERT INTO reservas (reserva_id, fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?)',
        [reserva_id, fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]
    );
}

export async function verificarDisponible(salon_id, fecha_reserva, turno_id) {
    const [rows] = await pool.query(
        'SELECT * FROM reservas WHERE salon_id = ? AND fecha_reserva = ? AND turno_id = ? AND activo = 1',
        [salon_id, fecha_reserva, turno_id]
    );
    return rows.length === 0; // Retorna true si está disponible, false si no lo está
}