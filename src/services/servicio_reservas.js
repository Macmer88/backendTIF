import * as modeloReservas from '../databases/modelo_reservas.js';
import { salonesPorId } from '../databases/modelo_salones.js';
import { deleteImage } from '../utils/fileutils.js';
import createError from 'http-errors';

export async function fetchReservas(activo,ordenar,desc,limit,offset) {
    return await modeloReservas.reservasConFiltro(activo,ordenar,desc,limit,offset);
}

export async function reservasById(id){
    const reserva = await modeloReservas.reservasPorId(id);
    if(!reserva){
        throw createError(404,'Reserva no encontrada')
    }
    if (reserva.activo !==1){
        return{
            mensaje: 'Reserva inactiva',
            reserva_id: reserva.reserva_id,
            usuario: reserva.usuario_id,
            estado: 'inactivo'
        };
    }
    return {mensaje: 'Reserva activa', reserva};
}

export async function fetchReservasPorSalon(salon_id){
    return await modeloReservas.reservasPorsalon(salon_id);
}

export async function modificarReserva(id, datos) {
    const { fecha_reserva, salon_id, turno_id, importe_total } = datos;
    if (
        fecha_reserva === undefined ||
        salon_id === undefined ||
        turno_id === undefined ||
        importe_total === undefined
    ) {
        throw  createError(400,"Faltan campos obligatorios");
    }

    await modeloReservas.updateReservas(id, { fecha_reserva, salon_id, turno_id, importe_total});
}

export async function eliminarReserva(id) {
    const estadoReserva = await modeloReservas.reservasPorId(id);
    console.log('estadoReserva:', estadoReserva);
    if (!estadoReserva) {
        throw createError(404,'La reserva no existe');
    }

    if (estadoReserva.activo === 0) {
        throw createError(400,'La reserva ya está inactiva');
    }
    await modeloReservas.deleteReserva(id);
    return { mensaje: 'Reserva eliminada' };
}

export async function reactivarReserva(id) {
    const estadoReserva = await modeloReservas.reservasPorId(id);
    if (!estadoReserva) {
        throw createError(404,'La reserva no existe');
    }
    if (estadoReserva.activo === 1) {
        throw createError(409,'La reserva ya está activa');
    }
    await modeloReservas.reactivateReserva(id);
    return { mensaje: 'La reserva fue reactivada con éxito' };
}

export async function crearReserva(datos) {
    const { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_total } = datos;
    const salon_elegido = await salonesPorId(salon_id);
    let importe = salon_elegido.importe;
    if (!fecha_reserva || !salon_id || !usuario_id || !turno_id || tematica === undefined || importe_total === undefined) {
        throw createError(400,"Faltan campos obligatorios");
    }

/*    const ultimoId = await modeloReservas.buscarUltId();
    const nuevoId = ultimoId + 1;*/ //No es necesario si la BD lo maneja automáticamente

    await modeloReservas.createReserva({fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon:importe, importe_total });

    return { mensaje: 'Reserva creada con éxito.' };
}

export async function verificarDisponibilidad(salon_id, fecha_reserva, turno_id) {
    const disponible = await modeloReservas.verificarDisponible(salon_id, fecha_reserva, turno_id);
    if (!disponible) {
        throw createError(409,'El salón no está disponible para la fecha y turno seleccionados');
    }
    return { mensaje: 'El salón está disponible' };
}


export const cambiarFoto = async (id, nuevoArchivo) => { 
    const idNumerico = parseInt(id, 10);

    const reserva = await modeloReservas.reservasPorId(idNumerico);
    if (!reserva) {
        throw createError(404, 'La reserva no fue encontrada.');
    }

    const fotoAntigua = reserva.foto_cumpleaniero;
    const datosParaActualizar = { foto_cumpleaniero: nuevoArchivo.filename };

    const reservaActualizada = await modeloReservas.actualizar(idNumerico, datosParaActualizar);

    await deleteImage(fotoAntigua);
    return reservaActualizada;
};