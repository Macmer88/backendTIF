import { fetchSalones } from '../services/servicio_salones.js';

export async function renderSalonesView(req, res) {
    try {
        const salones = await fetchSalones();
        res.render('salones', {
            title: 'Lista de salones',
            salones
        });
    } catch (err) {
        res.status(500).send('Error al consultar la BD');
    }
}
