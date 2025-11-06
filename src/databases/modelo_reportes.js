import { pool } from '../config/db.js';

export async function obtenerReporteReservasDetallado() {
    const query = `
        SELECT 
            r.reserva_id,
            r.fecha_reserva,
            -- CORRECCIÓN: Usamos COALESCE para evitar NULL en tematica
            COALESCE(r.tematica, '') AS tematica,
            r.importe_total,
            sa.titulo AS salon_titulo,
            t.hora_desde AS turno_desde,
            t.hora_hasta AS turno_hasta,
            u.nombre AS cliente_nombre,
            u.apellido AS cliente_apellido,
            u.celular AS cliente_celular,
            -- CORRECCIÓN: Usamos COALESCE para evitar NULL en servicios
            COALESCE(GROUP_CONCAT(se.descripcion SEPARATOR ', '), '') AS servicios_contratados
        FROM 
            reservas r
        JOIN 
            salones sa ON r.salon_id = sa.salon_id
        JOIN 
            turnos t ON r.turno_id = t.turno_id
        JOIN 
            usuarios u ON r.usuario_id = u.usuario_id
        LEFT JOIN 
            reservas_servicios rs ON r.reserva_id = rs.reserva_id
        LEFT JOIN 
            servicios se ON rs.servicio_id = se.servicio_id
        WHERE 
            r.activo = 1
        GROUP BY 
            r.reserva_id
        ORDER BY 
            r.fecha_reserva DESC;
    `;
    
    const [rows] = await pool.query(query);
    return rows;
}