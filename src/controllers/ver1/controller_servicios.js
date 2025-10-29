import * as servicio from '../../services/servicio_servicios.js';

export async function mostrarServicios(req, res, next) {
    const {
        inactivos,
        page = 1,
        limit = 10,
        ordenar,
        desc,
        buscar
    } = req.query;

    const estado = inactivos !== undefined ? 0 : 1;
    const offset = (page - 1) * limit;
    const esDesc = desc !== undefined;

    try {
        const resultado = await servicio.fetchServicios(
            estado,
            ordenar,
            esDesc,
            parseInt(limit),
            offset,
            buscar
        );
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

export async function mostrarServicioPorId(req, res, next) {
    const { id } = req.params;
    
    try {
        const resultado = await servicio.fetchServicioById(id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

export async function updateServicio(req, res, next) {
    try {
        const resultado = await servicio.modificarServicio(req.params.id, req.body);
        res.status(200).json({ resultado});
    } catch (err) {
        next(err);
    }
}

export async function borrarServicio(req, res, next){
    try{
        const resultado = await servicio.eliminarServicio(req.params.id);
        res.status(200).json(resultado);
    }catch(err){
        next(err);
    };
}

export async function volverServicioActivo(req, res, next){
    try{
        const resultado = await servicio.reactivarServicio(req.params.id);
        res.status(200).json(resultado);
    }catch(err){
    next(err);
    };
}

export async function nuevoServicio(req, res, next){
    try{
        const resultado = await servicio.crearServicio(req.body);
        res.status(201).json(resultado);
    }catch(err){
        next(err);
    }
}
