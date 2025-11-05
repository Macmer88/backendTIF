import createError from 'http-errors';
import * as modeloTurnos from '../databases/modelo_turnos.js';


export async function fetchTurnos(activo,ordenar,desc,limit,offset) {
    return await modeloTurnos.turnosConFiltro(activo,ordenar,desc,limit,offset);
}

export async function fetchTurnoById(id){
    const turno = await modeloTurnos.turnosPorId(id);
    if(!turno){
        throw createError(404,'Turno no encontrado');
    }
    if (turno.activo !==1){
        return{
            mensaje: 'Turno inactivo',
            turno_id: turno.turno_id,
            descripcion: turno.descripcion,
            estado: 'inactivo'
        };
    }
    return {mensaje: 'Turno activo', turno};
}

export async function modificarTurno(id, datos) {
    const { hora_desde, hora_hasta } = datos;

    const turnosSuperpuestos = await modeloTurnos.buscarTurnosSuperpuestos(hora_desde, hora_hasta, id);
    if (turnosSuperpuestos.length > 0) {
        throw createError(409, 'El rango de horario se superpone con un turno existente.');
    }
    await modeloTurnos.updateTurno(id, { hora_desde, hora_hasta });
    return { mensaje: 'Turno modificado con éxito' };
}

export async function eliminarTurno(id) {
    const estadoTurno = await modeloTurnos.turnosPorId(id);
    if (!estadoTurno) {
        throw createError(404,'El turno no existe');
    }

    if (estadoTurno.activo === 0) {
        throw createError(400,'El turno ya está inactivo');
    }
    await modeloTurnos.deleteTurno(id);
    return { mensaje: 'Turno eliminado' };
}



export async function reactivarTurno(id) {
    const estadoTurno = await modeloTurnos.turnosPorId(id);
    if (!estadoTurno) {
        throw createError(404,'El turno no existe');
    }
    if (estadoTurno.activo === 1) {
        throw createError(409,'El turno ya está activo');
    }
    await modeloTurnos.reactivateTurno(id);
    return { mensaje: 'El turno fue reactivado con éxito' };
}


export async function crearTurno(datos) {
    const { orden, hora_desde, hora_hasta } = datos;

    const turnoExistente = await modeloTurnos.buscarTurnoPorOrden(orden);
    if (turnoExistente) {
        throw createError(409, 'El número de orden ya está en uso por otro turno.');
    }

    const turnosSuperpuestos = await modeloTurnos.buscarTurnosSuperpuestos(hora_desde, hora_hasta);
    if (turnosSuperpuestos.length > 0) {
        throw createError(409, 'El rango de horario se superpone con un turno existente.');
    }
    
    await modeloTurnos.createTurno({ orden, hora_desde, hora_hasta });

    return { mensaje: 'Turno creado con éxito'};
}



