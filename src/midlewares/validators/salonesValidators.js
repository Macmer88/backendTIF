import { body, validationResult } from 'express-validator';
import { param } from 'express-validator';
import { obtenerSalonPorTitulo } from '../../services/servicio_salones.js';

// Validaciones para crear o actualizar salones
export const validarSalones = [
    body('titulo')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto'),

    body('capacidad')
        .notEmpty().withMessage('La capacidad es obligatoria')
        .isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero positivo'),

    body('direccion')
        .notEmpty().withMessage('La dirección es obligatoria')
        .isString().withMessage('La dirección debe ser un texto'),

    body('importe')
        .notEmpty().withMessage('Debe ingresar un importe')
        .isInt({ min: 1 }).withMessage('El importe debe ser un número entero positivo'),

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
        .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];


export async function verificarSalonExistente(req, res, next) {
    const { titulo } = req.body;

    try {
        const salon = await obtenerSalonPorTitulo(titulo);

        // Si existe y está activo, bloqueamos la creación o modificación
        if (salon && salon.activo === 1) {
            return res.status(409).json({
                error: 'Ya existe un salón activo con ese título',
                salon_id: salon.salon_id,
                estado: 'activo'
            });
        }

        next(); // No existe o está inactivo, se permite continuar
    } catch (err) {
        next(err); // En caso de error, lo enviamos al errorHandler
    }
}


//Validación antes de eliminar un salón
// -----------------------------------------------
// Antes de realizar un soft delete (PATCH o DELETE),
// se debe verificar si el salón tiene reservas futuras activas.
// Esto requiere consultar la tabla 'reservas' filtrando por:
// - salon_id
// - fecha >= hoy
//
// Si existen reservas futuras:
// - Bloquear la eliminación
// - O devolver advertencia al frontend
//
// Esta validación se implementará cuando se haya avanzado con la entidad 'reservas'.
