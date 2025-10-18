import * as serviciosUsuarios from '../../services/servicio_usuarios.js';
import { deleteImage } from '../../utils/fileutils.js';

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


export async function nuevoUsuario(req, res, next){
    try {
        // 1. Extraemos los datos de texto del body
        const datosDelBody = req.body;

        // 2. Verificamos si se subió un archivo
        if (!req.file) {
            // Si el archivo es obligatorio, lanzamos un error
            const error = new Error('La foto de usuario es obligatoria.');
            error.statusCode = 400;
            throw error;
        }

        // 3. Creamos el objeto de datos COMPLETO para el servicio
        const datosCompletos = {
            ...datosDelBody, // Copiamos todos los campos de texto
            foto: req.file.filename // Añadimos el nombre del archivo
        };

        // 4. Llamamos al servicio con el objeto ya unificado
        const resultado = await serviciosUsuarios.createUser(datosCompletos);
        
        res.status(201).json(resultado);
    } catch(err) {
        console.error("Error en crearUsuario:", err.message);
        next(err); 
    }
}

// Controlador para cambiar la foto del usuario


export const cambiarFotoUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Parámetros de la ruta (req.params):', req.params);

        if (!req.file) {
            return res.status(400).json({ msg: 'No se ha subido ningún archivo de imagen.' });
        }

        const usuarioActualizado = await serviciosUsuarios.cambiarFoto(id, req.file);

        res.status(200).json({
            msg: 'La foto fue actualizada con éxito.',
            usuario: usuarioActualizado,
        });
    } catch (error) {
        if (req.file) {
            await deleteImage(req.file.filename);
        }

        next(error);
    }
};