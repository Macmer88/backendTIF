/*

CÓDIGO EN CONSTRUCCIÓN - NO UTILIZAR




import { pool } from '../config/db.js';

export async function obtenerTodos() {
    const [rows] = await pool.query('SELECT * FROM reservas_servicios');
    return rows;
}

export async function obtenerPorId(id) {
    const [rows] = await pool.query(
        'SELECT * FROM reservas_servicios WHERE reserva_servicio_id = ?', [id]
    );
    return rows[0];
}

export async function obtenerPorReserva(reserva_id) {
    const [rows] = await pool.query(
        'SELECT * FROM reservas_servicios WHERE reserva_id = ?', [reserva_id]
    );
    return rows;
}

export async function crear({ reserva_id, servicio_id, importe }) {
    const [result] = await pool.query(
        `INSERT INTO reservas_servicios (reserva_id, servicio_id, importe, creado, modificado) VALUES (?, ?, ?, NOW(), NOW())`, [reserva_id, servicio_id, importe]
    );
    return result.insertId;
}

export async function actualizar(id, { reserva_id, servicio_id, importe }) {
    await pool.query(
        `UPDATE reservas_servicios SET reserva_id=?, servicio_id=?, importe=?, modificado=NOW() WHERE reserva_servicio_id=?`, [reserva_id, servicio_id, importe, id]
    );
}

export async function eliminar(id) {
    await pool.query(
        'DELETE FROM reservas_servicios WHERE reserva_servicio_id = ?', [id]
    );
}*/