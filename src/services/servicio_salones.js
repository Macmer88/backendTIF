import createError from 'http-errors';
import { salonesConFiltro, updateSalon, deleteSalon, reactivateSalon, createSalon, /*buscarUltId,*/ buscarPorTitulo, buscarPorDireccion } from '../databases/modelo_salones.js';
import { salonesPorId} from '../databases/modelo_salones.js';
import  {fetchReservasPorSalon} from '../services/servicio_reservas.js';

export async function fetchSalones(activo,ordenar,desc,limit,offset) {
    return await salonesConFiltro(activo,ordenar,desc,limit,offset);
}

export async function fetchSalonById(id){
    const salon = await salonesPorId(id);
    if(!salon){
        throw createError(404,'Salón no encontrado');
    }
    if (salon.activo !==1){
        return{
            mensaje: 'Salón inactivo',
            salon_id: salon.salon_id,
            titulo: salon.titulo,
            estado: 'inactivo'
        };
    }
    return {mensaje: 'Salón activo', salon};
}

export async function modificarSalon(id, datos) {
    const { titulo, direccion, capacidad, activo, importe } = datos;

    if (
        titulo === undefined ||
        direccion === undefined ||
        capacidad === undefined ||
        activo === undefined ||
        importe === undefined
    ) {
        throw createError(400,"Faltan campos obligatorios");
    }

    const activoInt = Number(activo);
    await updateSalon(id, { titulo, direccion, capacidad, activo: activoInt, importe });
}

export async function eliminarSalon(id) {
    const salon_id = id;
    const reservasAsociadas = await fetchReservasPorSalon(salon_id);
    if (reservasAsociadas.length > 0) {
        throw createError(409,'No se puede eliminar el salón porque tiene reservas activas asociadas');
    }
    const estadoSalon = await salonesPorId(id);
    console.log('estadoSalon:', estadoSalon);
    if (!estadoSalon) {
        throw createError(404,'El salón no existe');
    }

    if (estadoSalon.activo === 0) {
        throw createError(400,'El salón ya está inactivo');
    }
    await deleteSalon(id);
    return { mensaje: 'Salón eliminado' };
}

export async function reactivarSalon(id) {
    const estadoSalon = await salonesPorId(id);
    if (!estadoSalon) {
        throw createError(404,'El salón no existe');
    }
    if (estadoSalon.activo === 1) {
        throw createError(409,'El salón ya está activo');
    }
    await reactivateSalon(id);
    return { mensaje: 'EL salón fue reactivado con éxito' };
}


export async function crearSalon(datos) {
    const { titulo, direccion, capacidad, importe } = datos;

    if (!titulo || !direccion || capacidad === undefined || importe === undefined) {
        throw createError(400, "Faltan campos obligatorios");
    }

/*    const ultimoId = await buscarUltId(); //No se usa porque el id es autoincremental
    const nuevoId = ultimoId + 1;*/

    await createSalon({ /*salon_id: nuevoId,*/ titulo, direccion, capacidad, importe });

    return { mensaje: 'Salón creado con éxito', salon_id: datos.salon_id };
}


export async function obtenerSalonPorTitulo(titulo) {
    return await buscarPorTitulo(titulo);
}

export async function obtenerSalonPorDireccion(direccion) {
    return await buscarPorDireccion(direccion);
}

