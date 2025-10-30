import createError from 'http-errors';
import * as modeloServicios from '../databases/modelo_servicios.js';


export async function fetchServicios(activo,ordenar,desc,limit,offset, buscar) {
    return await modeloServicios.serviciosConFiltro(activo,ordenar,desc,limit,offset, buscar);
}

export async function fetchServicioById(id){
    const servicio = await modeloServicios.serviciosPorId(id);
    if(!servicio){
        throw createError(404,'Servicio no encontrado');
    }
    if (servicio.activo !==1){
        return{
            mensaje: 'Servicio inactivo',
            servicio_id: servicio.servicio_id,
            descripcion: servicio.descripcion,
            estado: 'inactivo'
        };
    }
    return {mensaje: 'Servicio activo', servicio};
}

export async function modificarServicio(id, datos) {
    const { descripcion, importe } = datos;

    if (
        descripcion === undefined ||
        importe === undefined
    ) {
        throw createError(400,"Faltan campos obligatorios");
    }

    await modeloServicios.updateServicio(id, { descripcion, importe });
    return { mensaje: 'Servicio modificado con éxito' };
}

export async function eliminarServicio(id) {
    const estadoServicio = await modeloServicios.serviciosPorId(id);
    if (!estadoServicio) {
        throw createError(404,'El servicio no existe');
    }

    if (estadoServicio.activo === 0) {
        throw createError(400,'El servicio ya está inactivo');
    }
    await modeloServicios.deleteServicio(id);
    return { mensaje: 'Servicio eliminado' };
}



export async function reactivarServicio(id) {
    const estadoServicio = await modeloServicios.serviciosPorId(id);
    if (!estadoServicio) {
        throw createError(404,'El servicio no existe');
    }
    if (estadoServicio.activo === 1) {
        throw createError(409,'El servicio ya está activo');
    }
    await modeloServicios.reactivateServicio(id);
    return { mensaje: 'El servicio fue reactivado con éxito' };
}


export async function crearServicio(datos) {
    const { descripcion, importe } = datos;

    if (!descripcion || importe === undefined) {
        throw createError(400, "Faltan campos obligatorios");
    }

    await modeloServicios.createServicio({ descripcion, importe });

    return { mensaje: 'Servicio creado con éxito'};
}



