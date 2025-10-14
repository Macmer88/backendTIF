/*

CÓDIGO EN CONSTRUCCIÓN - NO UTILIZAR

import * as modelo from '../databases/modelo_reservas_servicios.js';

export async function fetchReservasServicios() {
    return await modelo.obtenerTodos();
}

export async function reservasServiciosPorId(id) {
    const registro = await modelo.obtenerPorId(id);
    if (!registro) throw new Error('Reserva de servicio no encontrada');
    return registro;
}

export async function reservasServiciosPorReserva(reserva_id) {
    return await modelo.obtenerPorReserva(reserva_id);
}

export async function crearReservaServicio(datos) {
    const { reserva_id, servicio_id, importe } = datos;
    if (!reserva_id || !servicio_id || importe === undefined) {
        throw new Error('Faltan campos obligatorios');
    }

    const id = await modelo.crear({ reserva_id, servicio_id, importe });
    return { mensaje: 'Reserva de servicio creada', id };
}

export async function modificarReservaServicio(id, datos) {
    const existente = await modelo.obtenerPorId(id);
    if (!existente) throw new Error('No existe el registro');
    await modelo.actualizar(id, datos);
    return { mensaje: 'Reserva de servicio actualizada' };
}

export async function eliminarReservaServicio(id) {
    const existente = await modelo.obtenerPorId(id);
    if (!existente) throw new Error('No existe el registro');
    await modelo.eliminar(id);
    return { mensaje: 'Reserva de servicio eliminada' };
}

*/