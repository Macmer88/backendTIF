import { fetchSalones, modificarSalon } from '../../services/servicio_salones.js';
import { fetchSalonById } from '../../services/servicio_salones.js';
/*export async function renderSalonesJson(req, res) {
    try {
        const salones = await fetchSalones();
        res.json(salones);
    } catch (err) {
        res.status(500).send('Error al consultar la BD');
    }
}*/

/*export async function mostrarSalones(req, res) {
    const { inactivos, page = 1, limit = 10 } = req.query;

    const estado = inactivos !== undefined ? 0 : 1;
    const offset = (page - 1) * limit;

    try {
        const salones = await fetchSalones(estado,ordenar, parseInt(limit), offset);
        res.json(salones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener salones' });
    }
}*/


export async function mostrarSalones(req, res) {
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
        res.status(500).json({ error: 'Error al obtener salones' });
    }
}

export async function mostrarSalonPorId(req, res) {
    const { id } = req.params;
    
    try {
        const salon = await fetchSalonById(id);
        res.json(salon);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function updateSalon(req, res) {
    try {
        await modificarSalon(req.params.id, req.body);
        res.json({ message: 'Salón actualizado' });
    } catch (err) {
        console.error("Error en updateSalon:", err.message);
        res.status(500).json({ error: 'Error al actualizar' });
    }
}
