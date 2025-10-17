import * as serviciosUsuarios from '../../services/servicio_usuarios.js';

export async function mostrarUsuarios(req, res) {
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
        const usuarios = await serviciosUsuarios.fetchUsuarios(
            estado,
            ordenar,
            esDesc,
            parseInt(limit),
            offset
        );
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}

export async function mostrarUsuarioPorId(req, res) {
    const { id } = req.params;
    
    try {
        const usuario = await serviciosUsuarios.fetchUsuarioById(id);
        res.json(usuario);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}