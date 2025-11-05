import createError from 'http-errors';
import { salonesConFiltro, updateSalon, deleteSalon, reactivateSalon, createSalon, buscarPorTitulo, buscarPorDireccion } from '../databases/modelo_salones.js';
import { salonesPorId } from '../databases/modelo_salones.js';
import { fetchReservasPorSalon } from '../services/servicio_reservas.js';
import cache from '../utils/cache.js'; // (Ajusta la ruta si es necesario)

function invalidarCacheSalones(id = null) {
    console.log('--- BORRANDO CACHÉ DE SALONES ---');

    const keys = cache.keys();

    const listKeys = keys.filter(key => key.startsWith('salones_list:'));

    if (listKeys.length > 0) {
        cache.del(listKeys);
    }

    if (id) {
        cache.del(`salon:${id}`);
    }
}


export async function fetchSalones(activo, ordenar, desc, limit, offset) {
    const cacheKey = `salones_list:${JSON.stringify({ activo, ordenar, desc, limit, offset })}`;

    const cachedSalones = cache.get(cacheKey);
    if (cachedSalones) {
        console.log('Respondiendo desde CACHÉ (Lista de Salones)');
        return cachedSalones;
    }

    console.log('Respondiendo desde BASE DE DATOS (Lista de Salones)');
    const salones = await salonesConFiltro(activo, ordenar, desc, limit, offset);

    cache.set(cacheKey, salones);
    return salones;
}

export async function fetchSalonById(id) {
    const cacheKey = `salon:${id}`;

    const cachedSalon = cache.get(cacheKey);
    if (cachedSalon) {
        console.log(`Respondiendo desde CACHÉ (Salón ID: ${id})`);
        return cachedSalon;
    }

    console.log(`Respondiendo desde BASE DE DATOS (Salón ID: ${id})`);
    const salon = await salonesPorId(id);
    if (!salon) {
        throw createError(404, 'Salón no encontrado');
    }

    let response;
    if (salon.activo !== 1) {
        response = {
            mensaje: 'Salón inactivo',
            salon_id: salon.salon_id,
            titulo: salon.titulo,
            estado: 'inactivo'
        };
    } else {
        response = { mensaje: 'Salón activo', salon };
    }

    cache.set(cacheKey, response);
    return response;
}

export async function modificarSalon(id, datos) {
    const { titulo, direccion, capacidad, activo, importe } = datos;

    const activoInt = Number(activo);
    await updateSalon(id, { titulo, direccion, capacidad, activo: activoInt, importe });

    invalidarCacheSalones(id);
}

export async function eliminarSalon(id) {
    const salon_id = id;
    const reservasAsociadas = await fetchReservasPorSalon(salon_id);
    if (reservasAsociadas.length > 0) {
        throw createError(409, 'No se puede eliminar el salón porque tiene reservas activas asociadas');
    }
    const estadoSalon = await salonesPorId(id);
    console.log('estadoSalon:', estadoSalon);
    if (!estadoSalon) {
        throw createError(404, 'El salón no existe');
    }

    if (estadoSalon.activo === 0) {
        throw createError(400, 'El salón ya está inactivo');
    }
    await deleteSalon(id);

    invalidarCacheSalones(id);

    return { mensaje: 'Salón eliminado' };
}

export async function reactivarSalon(id) {
    const estadoSalon = await salonesPorId(id);
    if (!estadoSalon) {
        throw createError(404, 'El salón no existe');
    }
    if (estadoSalon.activo === 1) {
        throw createError(409, 'El salón ya está activo');
    }
    await reactivateSalon(id);

    invalidarCacheSalones(id);

    return { mensaje: 'EL salón fue reactivado con éxito' };
}

export async function crearSalon(datos) {
    const { titulo, direccion, capacidad, importe } = datos;

    await createSalon({ titulo, direccion, capacidad, importe });

    invalidarCacheSalones();

    return { mensaje: 'Salón creado con éxito', salon_id: datos.salon_id };
}


export async function obtenerSalonPorTitulo(titulo) {
    return await buscarPorTitulo(titulo);
}

export async function obtenerSalonPorDireccion(direccion) {
    return await buscarPorDireccion(direccion);
}