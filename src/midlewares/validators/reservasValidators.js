import { body, validationResult } from 'express-validator';
import { param } from 'express-validator';

// Validaciones para crear o actualizar reservas
export const validarReservas = [
    body('fecha_reserva')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isISO8601({ strict: true }).withMessage('La fecha debe tener formato YYYY-MM-DD'),

    body('salon_id')
        .notEmpty().withMessage('Debe ingresar un ID de salón')
        .isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
        .toInt(),
//El ID de usuario será tomado del token, no del body
    body('usuario_id')
        .notEmpty().withMessage('Debe ingresar un ID de Usuario')
        .isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
        .toInt(),

    body('turno_id')
        .notEmpty().withMessage('Debe ingresar un ID de turno')
        .isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
        .toInt(),

    body('foto_cumpleaniero')
        .optional() // .notEmpty() si es obligatorio
        .isString().withMessage('La foto debe ser un texto (nombre o ruta del archivo)'),

        body('tematica')
        .notEmpty()
        .isString().withMessage('La temática debe ser un texto'),

    body('importe_total') //Luego será calculado de forma automática
        .notEmpty().withMessage('El importe es obligatorio')
        .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo')
        .toFloat(),

        // Middleware final para verificar si hubo errores
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




