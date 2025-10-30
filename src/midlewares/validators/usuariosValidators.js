import { body, param, validationResult } from 'express-validator';

/**
 * Valida los datos al crear un nuevo usuario
 */
export const validarNuevoUsuario = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto'),

    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser un texto'),

    body('contrasenia')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

    body('tipo_usuario')
        .notEmpty().withMessage('El tipo de usuario es obligatorio')
        .isInt({ min: 1, max: 3 }).withMessage('El tipo de usuario debe ser un número (1=Cliente, 2=Empleado, 3=Admin)'), // Ajusta min/max a tus reglas

    body('celular')
        .notEmpty().withMessage('El celular es obligatorio')
        .isString().withMessage('El celular debe ser un texto'), // O usa .isMobilePhone('es-AR') si quieres ser más estricto

    // Middleware final para verificar si hubo errores de formato
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

/**
 * Valida el ID de usuario que viene por URL
 */
export const validarIdUsuario = [
    param('id')
        .notEmpty().withMessage('El ID es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
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

export const validarActualizacionUsuario = [
    body('nombre')
        .optional() // Hace que el campo sea opcional (no obligatorio enviarlo)
        .notEmpty().withMessage('El nombre no puede estar vacío si se envía')
        .isString().withMessage('El nombre debe ser un texto'),

    body('apellido')
        .optional()
        .notEmpty().withMessage('El apellido no puede estar vacío si se envía')
        .isString().withMessage('El apellido debe ser un texto'),

    body('tipo_usuario')
        .optional()
        .isInt({ min: 1, max: 3 }).withMessage('El tipo de usuario debe ser un número válido (1-3)'),

    body('celular')
        .optional()
        .notEmpty().withMessage('El celular no puede estar vacío si se envía')
        .isString().withMessage('El celular debe ser un texto'),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

//U9SLffxW7HU4YUB