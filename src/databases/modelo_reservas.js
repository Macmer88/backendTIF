import { pool } from '../config/db.js';



export async function reservasConFiltro(activo, ordenar, limit, offset, esDesc, usuarioIdFiltro = null) {
    
    let query = 'SELECT * FROM reservas WHERE 1=1';
    let params = [];

    // 1. FILTRO DE SEGURIDAD
    if (usuarioIdFiltro !== null) {
        query += ' AND usuario_id = ?';
        params.push(usuarioIdFiltro);
    }

    // 2. FILTRO DE ESTADO
    if (activo !== undefined) {
        query += ' AND activo = ?';
        params.push(activo);
    }
    
    // 3. ORDENAMIENTO (Usa la variable booleana 'esDesc' recibida)
    const columnaOrdenar = ordenar || 'reserva_id';
    const direccion = esDesc ? 'DESC' : 'ASC'; 

    const columnasValidas = ['reserva_id','salon_id', 'usuario_id', 'importe_salon', 'fecha_reserva', 'creado', 'importe_total'];
        
    if (columnasValidas.includes(columnaOrdenar)) {
        query += ` ORDER BY ${columnaOrdenar} ${direccion}`;
    } else {
        query += ` ORDER BY reserva_id ${direccion}`;
    }

    // 4. PAGINACIÓN
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const [rows] = await pool.query(query, params);
    return rows;
}

export async function reservasPorId(id){
    const [rows] = await pool.query('SELECT * FROM reservas WHERE reserva_id = ?', [id]);
    return rows[0];
}

export async function reservasPorsalon(salon_id){
    const [rows] = await pool.query('SELECT * FROM reservas WHERE salon_id = ? AND activo = 1 AND fecha_reserva >= CURDATE()', [salon_id]);
    return rows;
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


export async function createReserva(datos, connection) {
    const { 
        fecha_reserva, salon_id, usuario_id, turno_id, 
        foto_cumpleaniero, tematica, importe_salon 
    } = datos;

    const query = `
        INSERT INTO reservas 
        (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.query(query, [
        fecha_reserva, salon_id, usuario_id, turno_id, 
        foto_cumpleaniero, tematica, importe_salon
    ]);

    return result.insertId;
}

/*
export async function createReserva(datos) {
    const { reserva_id, fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total } = datos;
    await pool.query(
        'INSERT INTO reservas (reserva_id, fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?)',
        [reserva_id, fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total]
    );
}*/

export async function verificarDisponible(salon_id, fecha_reserva, turno_id) {
    const [rows] = await pool.query(
        'SELECT * FROM reservas WHERE salon_id = ? AND fecha_reserva = ? AND turno_id = ? AND activo = 1',
        [salon_id, fecha_reserva, turno_id]
    );
    return rows.length === 0; // Retorna true si está disponible, false si no lo está
}

export async function actualizar(reserva_id, datosParaActualizar) {
    const nuevoNombreFoto = datosParaActualizar.foto_cumpleaniero;
    const [resultado] = await pool.query(
        'UPDATE reservas SET foto_cumpleaniero = ? WHERE reserva_id = ?',
        [nuevoNombreFoto, reserva_id]
    );
    return resultado;
}


export async function insertarServicioEnReserva(reserva_id, servicio_id, importe_servicio, connection) {
    const query = `
        INSERT INTO reservas_servicios 
        (reserva_id, servicio_id, importe) 
        VALUES (?, ?, ?)
    `;
    
    // Usa la 'connection'
    await connection.query(query, [reserva_id, servicio_id, importe_servicio]);
}


export async function actualizarImporteTotalReserva(reserva_id, importe_total, connection) {
    const query = 'UPDATE reservas SET importe_total = ? WHERE reserva_id = ?';
    
    // Usa la 'connection'
    await connection.query(query, [importe_total, reserva_id]);
}