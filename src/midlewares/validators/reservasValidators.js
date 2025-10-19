import { body, validationResult } from 'express-validator';
import { param } from 'express-validator';
import { salonesPorId } from '../../databases/modelo_salones.js';
import {usuariosPorId} from '../../databases/modelo_usuarios.js';
//import { turnosPorId } from '../../databases/modelo_turnos.js';

// Validaciones para crear o actualizar reservas
export const validarReservas = [
    body('fecha_reserva')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isISO8601({ strict: true }).withMessage('La fecha debe tener formato YYYY-MM-DD')
        .custom((value) => {
            const fechaReserva = new Date(value + 'T00:00:00'); 
            const ahora = new Date();

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // Setea a la medianoche de hoy
            if (fechaReserva < hoy) {
                throw new Error('No se puede reservar en una fecha pasada.');
            }

            // Regla: No se puede reservar con menos de 72h de anticipacion
            const limiteMinimo = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 horas desde este instante
            if (fechaReserva < limiteMinimo) {
                throw new Error('Se debe reservar con al menos 72 horas de anticipación.');
            }

            // Regla: No se puede reservar un salon para más de 6 meses en el futuro.
            const limiteMaximo = new Date();
            limiteMaximo.setMonth(limiteMaximo.getMonth() + 6);
            if (fechaReserva > limiteMaximo) {
                throw new Error('No se puede reservar con más de 6 meses de antelación.');
            }

            // Si pasa todas las validaciones de fecha
            return true;
        }),

    body('salon_id')
        .notEmpty().withMessage('Debe ingresar un ID de salón')
        .isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
        .toInt()
        .custom(async (salon_id) => {
            const salon = await salonesPorId(salon_id);
            if (!salon || salon.activo === 0) {
                throw new Error('El salón seleccionado no existe o no está disponible.');
            }
            return true;
        }),

    body('usuario_id')
        .notEmpty().withMessage('Debe ingresar un ID de Usuario')
        .isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
        .toInt()
        .custom(async (usuario_id) => {
            const usuario = await usuariosPorId(usuario_id);
            if (!usuario || usuario.activo === 0) {
                throw new Error('El usuario seleccionado no existe o no está disponible.');
            }
            return true;
        }),

        /*.custom(async (turno_id) => {
            const turno = await turnosPorId(turno_id);
            if (!turno || turno.activo === 0) {
                throw new Error('El turno seleccionado no existe o no está disponible.');
            }
            return true;
        }),*/

    body('foto_cumpleaniero')
        .optional()
        .isString().withMessage('La foto debe ser un texto (nombre o ruta del archivo)'),

    body('tematica')
        .notEmpty()
        .isString().withMessage('La temática debe ser un texto'),

    body('importe_total')
        .notEmpty().withMessage('El importe es obligatorio')
        .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo')
        .toFloat(),

    //middleware final de validación
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

export const validarIdReserva = [
    param('id')
        .notEmpty().withMessage('El ID es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
        .toInt(),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];







