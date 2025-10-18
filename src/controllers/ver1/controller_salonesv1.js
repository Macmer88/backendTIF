import { fetchSalones, modificarSalon, eliminarSalon, reactivarSalon, crearSalon } from '../../services/servicio_salones.js';
import { fetchSalonById } from '../../services/servicio_salones.js';

export async function mostrarSalones(req, res, next) {
    const {
        inactivos,
        page = 1,
        limit = 10,
        ordenar,
        desc
    } = req.query;

    const estado = inactivos !== undefined ? 0 : 1;
    const offset = (page - 1) * limit;
    const esDesc = desc !== undefined;

    try {
        const salones = await fetchSalones(
            estado,
            ordenar,
            esDesc,
            parseInt(limit),
            offset
        );
        res.json(salones);
    } catch (error) {
        next(error);
    }
}

export async function mostrarSalonPorId(req, res, next) {
    const { id } = req.params;
    
    try {
        const salon = await fetchSalonById(id);
        res.json(salon);
    } catch (error) {
        next(error);
    }
}

export async function updateSalon(req, res, next) {
    try {
        await modificarSalon(req.params.id, req.body);
        res.json({ message: 'Salón actualizado' });
    } catch (err) {
        next(err);
    }
}

export async function borrarSalon(req, res, next){
    try{
        await eliminarSalon(req.params.id);
        res.json({mensaje: 'Salón eliminado'});
    }catch(err){
        next(err);
    };
}

export async function volverSalonActivo(req, res, next){
    try{
        await reactivarSalon(req.params.id);
        res.json({mensaje: 'Salón reactivado'});
    }catch(err){
    next(err);
    };
}

export async function nuevoSalon(req, res, next){
    try{
        await crearSalon(req.body);
        res.json({mensaje: 'Salón creado'});
    }catch(err){
        next(err);
    }
}