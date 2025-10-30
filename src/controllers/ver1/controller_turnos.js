import * as turno from '../../services/servicio_turnos.js';

export async function mostrarTurnos(req, res, next) {
    const {
        inactivos,
        page = 1,
        limit = 10,
        ordenar,
        desc,
    } = req.query;

    const estado = inactivos !== undefined ? 0 : 1;
    const offset = (page - 1) * limit;
    const esDesc = desc !== undefined;

    try {
        const resultado = await turno.fetchTurnos(
            estado,
            ordenar,
            esDesc,
            parseInt(limit),
            offset
        );
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

export async function mostrarTurnoPorId(req, res, next) {
    const { id } = req.params;

    try {
        const resultado = await turno.fetchTurnoById(id);
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

export async function updateTurno(req, res, next) {
    try {
        const resultado = await turno.modificarTurno(req.params.id, req.body);
        res.status(200).json({ resultado });
    } catch (err) {
        next(err);
    }
}

export async function borrarTurno(req, res, next) {
    try {
        const resultado = await turno.eliminarTurno(req.params.id);
        res.status(200).json(resultado);
    } catch (err) {
        next(err);
    }
}

export async function volverTurnoActivo(req, res, next) {
    try {
        const resultado = await turno.reactivarTurno(req.params.id);
        res.status(200).json(resultado);
    } catch (err) {
        next(err);
    }
}

export async function nuevoTurno(req, res, next) {
    try {
        const resultado = await turno.crearTurno(req.body);
        res.status(201).json(resultado);
    } catch (err) {
        next(err);
    }
}