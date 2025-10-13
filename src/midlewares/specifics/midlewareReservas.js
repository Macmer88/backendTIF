import {verificarDisponibilidad} from '../../services/servicio_reservas.js';

export async function validarFecha(req, res, next) {
    const { fecha_reserva } = req.body;
    const hoy = new Date().toISOString().split('T')[0];

    if (fecha_reserva < hoy) {
        const error = new Error('No se puede reservar una fecha pasada');
        error.statusCode = 400;
        return next(error);
    }
    next();
}

export async function validarExtension(req, res, next) {
    const { fecha_reserva } = req.body;
    const fecha_maxima = new Date();
    fecha_maxima.setMonth(fecha_maxima.getMonth() + 6);
    try {
        if (new Date(fecha_reserva) > fecha_maxima) {
            const error = new Error('No se puede reservar con más de 6 meses de anticipación');
            error.statusCode = 400;
            return next(error);
        }
        next();
    } catch (error) {
        next(error);
    }
};

export async function validarAnticipacion(req, res, next) {
    try {
        const { fecha_reserva } = req.body; // Ej: "2025-10-16"

        const partes = fecha_reserva.split('-');
        const fechaReservaLocal = new Date(partes[0], partes[1] - 1, partes[2]);

        const fechaMinimaPermitida = new Date();
        fechaMinimaPermitida.setHours(fechaMinimaPermitida.getHours() + 72);

        if (fechaReservaLocal < fechaMinimaPermitida) {
            const error = new Error('Debe reservar con al menos 72 horas de anticipación');
            error.statusCode = 400;
            return next(error);
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

export async function estaDisponible(req, res, next) {
    const { fecha_reserva, salon_id, turno_id } = req.body;

    try {
        await verificarDisponibilidad(salon_id, fecha_reserva, turno_id);
        next();
    } catch (error) {
        next(error);}
};  