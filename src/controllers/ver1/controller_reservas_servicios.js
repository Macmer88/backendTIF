import * as servicio from '../../services/servicio_reservas_servicios.js';

export async function mostrarReservasServicios(req, res) {
    try {
        const data = await servicio.fetchReservasServicios();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener reservas-servicios' });
    }
}

export async function mostrarReservaServicioPorId(req, res) {
    try {
        const data = await servicio.reservasServiciosPorId(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export async function mostrarPorReserva(req, res) {
    try {
        const data = await servicio.reservasServiciosPorReserva(req.params.reserva_id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al listar servicios de la reserva' });
    }
}

export async function crearReservaServicio(req, res) {
    try {
        const resultado = await servicio.crearReservaServicio(req.body);
        res.status(201).json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateReservaServicio(req, res) {
    try {
        const resultado = await servicio.modificarReservaServicio(req.params.id, req.body);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function borrarReservaServicio(req, res) {
    try {
        const resultado = await servicio.eliminarReservaServicio(req.params.id);
        res.json(resultado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}