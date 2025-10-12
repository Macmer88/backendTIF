import { obtenerSalonPorTitulo, obtenerSalonPorDireccion} from '../../services/servicio_salones.js';

export async function verificarSalonExistente(req, res, next) {
    const { titulo, direccion } = req.body;

    try {
        const salon = await obtenerSalonPorTitulo(titulo);
        const salonDireccion = await obtenerSalonPorDireccion(direccion);

        // Si existe y está activo, bloqueamos la creación
        if (salon && salon.activo === 1) {
            return res.status(409).json({
                error: 'Ya existe un salón activo con ese título',
                salon_id: salon.salon_id,
                estado: 'activo'
            })
        }else if (salon && salon.activo === 0) {
            return res.status(409).json({
                error: 'Existe un salón con ese título, pero está inactivo. Por favor, reactivarlo si desea usarlo.',
                salon_id: salon.salon_id,
                estado: 'inactivo'
            });
        };

        if (salonDireccion && salonDireccion.direccion === direccion && salonDireccion.activo === 1) {
            return res.status(409).json({
                error: 'Ya existe un salón activo con esa dirección',
                salon_id: salonDireccion.salon_id,
                estado: 'activo'
            })
        }else if (salonDireccion && salonDireccion.direccion === direccion && salonDireccion.activo === 0) {
            return res.status(409).json({
                error: 'Existe un salón con esa direccion, pero está inactivo. Por favor, reactivarlo si desea usarlo.',
                salon_id: salonDireccion.salon_id,
                estado: 'inactivo'
            });
        };

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
