import { body, validationResult, param } from 'express-validator';
import { salonesPorId } from '../../databases/modelo_salones.js';
import { usuariosPorId } from '../../databases/modelo_usuarios.js';
import { turnosPorId } from '../../databases/modelo_turnos.js'; 
import { serviciosPorId } from '../../databases/modelo_servicios.js'; 

// Validaciones para crear o actualizar reservas
export const validarReservas = [
    // --- Validación de fecha_reserva 
    body('fecha_reserva')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isISO8601({ strict: true }).withMessage('La fecha debe tener formato YYYY-MM-DD')
        .custom((value) => {
            const fechaReserva = new Date(value + 'T00:00:00'); 
            const ahora = new Date();
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (fechaReserva < hoy) {
                throw new Error('No se puede reservar en una fecha pasada.');
            }
            const limiteMinimo = new Date(Date.now() + 72 * 60 * 60 * 1000);
            if (fechaReserva < limiteMinimo) {
                throw new Error('Se debe reservar con al menos 72 horas de anticipación.');
            }
            const limiteMaximo = new Date();
            limiteMaximo.setMonth(limiteMaximo.getMonth() + 6);
            if (fechaReserva > limiteMaximo) {
                throw new Error('No se puede reservar con más de 6 meses de antelación.');
            }
            return true;
        }),

    // --- Validación de salon_id
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


    //validación de turno_id 
    body('turno_id')
        .notEmpty().withMessage('Debe ingresar un ID de Turno')
        .isInt({ min: 1 }).withMessage('El id debe ser un número entero positivo')
        .toInt()
        .custom(async (turno_id) => {
            const turno = await turnosPorId(turno_id);
            if (!turno || turno.activo === 0) {
                throw new Error('El turno seleccionado no existe o no está disponible.');
            }
            return true;
        }),

    body('foto_cumpleaniero')
        .optional()
        .isString().withMessage('La foto debe ser un texto (nombre o ruta del archivo)'),

    body('tematica')
        .notEmpty().withMessage('La temática es obligatoria')
        .isString().withMessage('La temática debe ser un texto'),

    // --- 2. QUITAMOS la validación de importe_total ---
    // Ya no es necesaria, porque la calcularemos en el servicio (Paso 2 del plan)
    /*
    body('importe_total')
        .notEmpty().withMessage('El importe es obligatorio')
        .isFloat({ min: 0 }).withMessage('El importe debe ser un número positivo')
        .toFloat(),
    */

    // Validación de servicios 
    body('servicios')
        .notEmpty().withMessage('El listado de servicios es obligatorio')
        .isJSON().withMessage('El formato de servicios debe ser un array JSON (enviado como string).')
        
        // Sanitizer: Convertimos el string "[1, 2, 3]" en un array real [1, 2, 3]
        // y lo reemplazamos en req.body para que el controlador lo reciba listo.
        .customSanitizer(value => {
            try {
                return JSON.parse(value);
            } catch (e) {
                return []; // Si el parseo falla, devuelve array vacío
            }
        })

        // Ahora validamos el array que acabamos de crear
        .isArray({ min: 2 }).withMessage('Debe seleccionar al menos dos servicios.')
        
        // Verificamos que todos los servicios del array existan y estén activos
        .custom(async (serviciosArray) => {
            if (!serviciosArray.every(id => typeof id === 'number' && id > 0)) {
                throw new Error('Todos los IDs de servicios deben ser números enteros positivos.');
            }

            // Chequeamos cada servicio en la BD
            for (const id of serviciosArray) {
                const servicio = await serviciosPorId(id); 
                if (!servicio || servicio.activo === 0) {
                    throw new Error(`El servicio con ID ${id} no existe o no está disponible.`);
                }
            }
            
            return true; // Si todos los servicios son válidos
        }),

    // Middleware final de validación
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

// validación de ID 
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