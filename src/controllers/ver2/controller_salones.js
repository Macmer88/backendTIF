import { fetchSalones } from '../../services/servicio_salones.js';

/*export async function renderSalonesView(req, res) {
    try {
        const salones = await fetchSalones(activo,ordenar,desc,limit,offset);
        res.render('salones', {
            title: 'Lista de salones',
            salones
        });
    } catch (err) {
        res.status(500).send('Error al consultar la BD');
    }
}
*/
export async function renderSalonesView(req, res) {
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
        res.render('salones', {
            title: 'Lista de salones',
            salones
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener salones' });
    }
}