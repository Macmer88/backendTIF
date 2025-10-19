import {verificarDisponibilidad} from '../../services/servicio_reservas.js';


export async function estaDisponible(req, res, next) {
    const { fecha_reserva, salon_id, turno_id } = req.body;

    try {
        await verificarDisponibilidad(salon_id, fecha_reserva, turno_id);
        next();
    } catch (error) {
        next(error);}
};  