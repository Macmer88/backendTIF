import { body, param, validationResult } from 'express-validator';


export const validarServicio = [
    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria')
        .isString().withMessage('La descripción debe ser un texto'),

    body('importe')
        .notEmpty().withMessage('El importe es obligatorio')
        .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo'),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

export const validarIdServicio = [
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