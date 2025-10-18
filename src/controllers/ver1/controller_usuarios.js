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

export async function eliminarUsuario(req, res) {
    const { id } = req.params;

    try {
        const resultado = await serviciosUsuarios.deleteUsuario(id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function reactivarUsuario(req, res) {
    const { id } = req.params;

    try {
        const resultado = await serviciosUsuarios.reactivateUsuario(id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function actualizarUsuario(req, res) {
    const { id } = req.params;
    const datos = req.body;

    try {
        await serviciosUsuarios.updateUsuario(id, datos);
        res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (error) {
        if (error.message === "Faltan campos obligatorios") {
            res.status(400).json({ error: error.message });
        } else {
            res.status(404).json({ error: error.message });
        }
    }
}