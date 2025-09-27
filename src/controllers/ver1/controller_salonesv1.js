import { fetchSalones } from '../../services/servicio_salones.js';

export async function renderSalonesJson(req, res) {
    try {
        const salones = await fetchSalones();
        res.json(salones);
    } catch (err) {
        res.status(500).send('Error al consultar la BD');
    }
}
