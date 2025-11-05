import { body, param, validationResult } from 'express-validator';

export const validarTurno = [
    body('orden')
        .notEmpty().withMessage('El número de orden es obligatorio')
        .isInt({ min: 1 }).withMessage('El orden debe ser un número entero positivo')
        .toInt(),

    body('hora_desde')
        .notEmpty().withMessage('La hora de inicio es obligatoria')
        .matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)
        .withMessage('La hora de inicio debe tener el formato HH:MM'),

    body('hora_hasta')
        .notEmpty().withMessage('La hora de fin es obligatoria')
        .matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)
        .withMessage('La hora de fin debe tener el formato HH:MM'),

    body('hora_hasta').custom((value, { req }) => {
        const hora_desde = req.body.hora_desde;

        const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
        if (regex.test(value) && regex.test(hora_desde) && value <= hora_desde) {
            throw new Error('La hora de fin debe ser posterior a la hora de inicio');
        }
        return true;
    }),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

export const validarIdTurno = [
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