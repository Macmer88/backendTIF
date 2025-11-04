import { pool } from '../config/db.js';
import { serviciosPorId } from '../databases/modelo_servicios.js';
import * as modeloReservas from '../databases/modelo_reservas.js';
import { salonesPorId } from '../databases/modelo_salones.js';
import { deleteImage } from '../utils/fileutils.js';
import createError from 'http-errors';



export async function fetchReservas(activo,ordenar,desc,limit,offset) {
    return await modeloReservas.reservasConFiltro(activo,ordenar,desc,limit,offset);
}

export async function reservasById(id, usuarioAutenticado){
    const reserva = await modeloReservas.reservasPorId(id);
    if(!reserva){
        throw createError(404,'Reserva no encontrada')
    }

    // --- LÓGICA DE PERTENENCIA AÑADIDA ---
    const esAdmin = usuarioAutenticado.tipo_usuario === 3;
    const esEmpleado = usuarioAutenticado.tipo_usuario === 2;
    // Comparamos el 'usuario_id' de la reserva con el 'usuario_id' del token
    const esPropietario = reserva.usuario_id === usuarioAutenticado.usuario_id;

    // Si el usuario NO es Admin, Y NO es Empleado, Y NO es el propietario
    if (!esAdmin && !esEmpleado && !esPropietario) {
        // Es un Cliente (Rol 1) intentando ver la reserva de otro.
        throw createError(403, 'Acceso denegado. No tienes permiso para ver esta reserva.');
    }
    // --- FIN LÓGICA DE PERTENENCIA ---

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
    // 1. Obtenemos TODOS los datos del validador.
    // 'servicios' ya es un array [1, 2, 3] gracias al validador.
    const { 
        fecha_reserva, salon_id, usuario_id, turno_id, 
        foto_cumpleaniero, tematica, servicios // <-- ¡El array!
    } = datos;

    // 2. Obtenemos el importe del salón (esto ya lo hacías)
    const salon_elegido = await salonesPorId(salon_id);
    if (!salon_elegido) {
        throw createError(404, 'El salón seleccionado no existe');
    }
    const importe_salon = parseFloat(salon_elegido.importe);

    // --- INICIO DE LA TRANSACCIÓN ---
    // 3. Definimos la conexión fuera del try
    let connection;

try {
        // 4. Obtenemos una conexión del pool
        connection = await pool.getConnection();
        // 5. Iniciamos la transacción
        await connection.beginTransaction();

        // --- INICIO DE LA LÓGICA (NUEVO) ---

        // PASO 6: Crear la reserva principal
        // Preparamos los datos (sin el array 'servicios')
        const datosReserva = {
            fecha_reserva, salon_id, usuario_id, turno_id,
            foto_cumpleaniero, tematica, importe_salon
        };
        
        // Llamamos al DAO modificado (pasando la 'connection')
        // y guardamos el ID que nos devuelve.
        const nuevaReservaId = await modeloReservas.createReserva(datosReserva, connection);

        // PASO 7: Preparar el bucle para los servicios
        let importe_servicios_total = 0;

        // PASO 8: Iterar e insertar los servicios en la tabla pivote
        // 'servicios' es el array [1, 2, 3] que viene de 'datos'
        for (const servicio_id of servicios) {
            
            // 8a. Obtenemos el precio del servicio (usando el import que añadimos)
            const servicio = await serviciosPorId(servicio_id);
            
            // 8b. Verificamos (aunque el validador ya lo hizo, es una buena práctica)
            if (!servicio) {
                // Si el validador falló o se desactivó, esto nos protege.
                throw createError(404, `El servicio con ID ${servicio_id} no existe.`);
            }

            const importe_servicio_actual = parseFloat(servicio.importe);
            
            // 8c. Llamamos al nuevo DAO (pasando la 'connection')
            await modeloReservas.insertarServicioEnReserva(
                nuevaReservaId, 
                servicio_id, 
                importe_servicio_actual, 
                connection
            );
            
            // 8d. Sumamos al total de servicios
            importe_servicios_total += importe_servicio_actual;
        }

        // PASO 9: Calcular y actualizar el importe_total final
        const importe_final_total = importe_salon + importe_servicios_total;

        // PASO 10: Llamamos al DAO (pasando la 'connection')
        await modeloReservas.actualizarImporteTotalReserva(
            nuevaReservaId,
            importe_final_total,
            connection
        );

        // --- FIN DE LA LÓGICA ---

        // PASO 11: COMMIT (Antes era el paso 9)
        // Si todo lo anterior (Pasos 6-10) funcionó, confirmamos.
        await connection.commit();

        // PASO 12: Devolvemos la respuesta final (Antes era el paso 10)
        return { 
            mensaje: 'Reserva creada con éxito.',
            reserva_id: nuevaReservaId,
            importe_total: importe_final_total 
        };

    } catch (error) {
        // --- ERROR: Si algo falla, deshacemos todo ---
        // (El bloque catch y finally quedan exactamente igual que en el paso anterior)
        
        // 11. Hacemos ROLLBACK si la conexión existe
        if (connection) {
            await connection.rollback();
        }
        
        // 12. Relanzamos el error para que lo atrape el controlador
        if (error.status) {
            throw error;
        } else {
            console.error("Error en transacción de reserva:", error.message);
            throw createError(500, "Error al procesar la reserva, la operación fue cancelada.");
        }

    } finally {
        // --- PASE LO QUE PASE, liberamos la conexión ---
        // 13. Si la conexión se estableció, la devolvemos al pool
        if (connection) {
            connection.release();
        }
    }
}


/*

export async function crearReserva(datos) {
    const { fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_total } = datos;
    const salon_elegido = await salonesPorId(salon_id);
    let importe = salon_elegido.importe;
    if (!fecha_reserva || !salon_id || !usuario_id || !turno_id || tematica === undefined || importe_total === undefined) {
        throw createError(400,"Faltan campos obligatorios");
    }


    await modeloReservas.createReserva({fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon:importe, importe_total });

    return { mensaje: 'Reserva creada con éxito.' };
}
*/


export async function verificarDisponibilidad(salon_id, fecha_reserva, turno_id) {
    const disponible = await modeloReservas.verificarDisponible(salon_id, fecha_reserva, turno_id);
    if (!disponible) {
        throw createError(409,'El salón no está disponible para la fecha y turno seleccionados');
    }
    return { mensaje: 'El salón está disponible' };
}


export const cambiarFoto = async (id, nuevoArchivo, usuarioAutenticado) => {
    const idNumerico = parseInt(id, 10);

    const reserva = await modeloReservas.reservasPorId(idNumerico);
    if (!reserva) {
        throw createError(404, 'La reserva no fue encontrada.');
    }

    const esAdmin = usuarioAutenticado.tipo_usuario === 3;
    const esPropietario = reserva.usuario_id === usuarioAutenticado.usuario_id;

    if (!esAdmin && !esPropietario) {
        throw createError(403, 'Acceso denegado. No tienes permiso para modificar esta reserva.');
    }

    const fotoAntigua = reserva.foto_cumpleaniero;
    const datosParaActualizar = { foto_cumpleaniero: nuevoArchivo.filename };

    const reservaActualizada = await modeloReservas.actualizar(idNumerico, datosParaActualizar);

    await deleteImage(fotoAntigua);
    return reservaActualizada;
};