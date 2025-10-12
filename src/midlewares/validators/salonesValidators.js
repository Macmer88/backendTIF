import { body, validationResult } from 'express-validator';
import { param } from 'express-validator';

// Validaciones para crear o actualizar salones
export const validarSalones = [
    body('titulo')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto'),

    body('capacidad')
        .notEmpty().withMessage('La capacidad es obligatoria')
        .isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero positivo')
        .toInt(),

    body('direccion')
        .notEmpty().withMessage('La dirección es obligatoria')
        .isString().withMessage('La dirección debe ser un texto'),

    body('importe')
        .notEmpty().withMessage('Debe ingresar un importe')
        .isInt({ min: 1 }).withMessage('El importe debe ser un número entero positivo')
        .toInt(),

    // Middleware final para verificar si hubo errores
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];
export const validarIdSalon = [
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


