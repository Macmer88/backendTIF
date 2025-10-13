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
    fecha_maxima.setMonth() + 6;
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

export async function estaDisponible(req, res, next) {
    const { fecha_reserva, salon_id, turno_id } = req.body;

    try {
        await verificarDisponibilidad(salon_id, fecha_reserva, turno_id);
        next();
    } catch (error) {
        next(error);}
};  