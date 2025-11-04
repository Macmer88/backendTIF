import * as servicioReservas from '../../services/servicio_reservas.js';
import { deleteImage } from '../../utils/fileutils.js';

export async function mostrarReservas(req, res, next) {
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
        const reservas = await servicioReservas.fetchReservas(
            estado,
            ordenar,
            esDesc,
            parseInt(limit),
            offset
        );
        res.json(reservas);
    } catch (error) {
        next(error);
    }
}

export async function mostrarReservasPorId(req, res, next) {
    const { id } = req.params;
    const usuarioAutenticado = req.user;
    
    try {
        const reservas = await servicioReservas.reservasById(id, usuarioAutenticado); 
        res.json(reservas);
    } catch (error) {
        next(error);
    }
}

export async function updateReserva(req, res, next) {
    try {
        console.log("ID:", req.params.id);
        console.log("Body:", req.body);

        await servicioReservas.modificarReserva(req.params.id, req.body);
        res.json({ message: 'Reserva actualizada' });
    } catch (err) {
    next(err);
    }
}

export async function borrarReserva(req, res, next){
    try{
        await servicioReservas.eliminarReserva(req.params.id);
        res.json({mensaje: 'Reserva eliminada'});
    }catch(err){
        next(err);
    };
}

export async function volverReservaActiva(req, res, next){
    try{
        const resultado = await servicioReservas.reactivarReserva(req.params.id);
        res.status(201).json(resultado);
    }catch(err){
        next(err);
    };
}


export async function nuevaReserva(req, res, next){ 
    try{
        // 1. Extraemos los datos de texto del body
        const datosDelBody = req.body;

        // 2. Verificamos si se subió un archivo
        if (!req.file) {
            // Si el archivo es obligatorio, lanzamos un error
            const error = new Error('La foto del cumpleañero es obligatoria.');
            error.statusCode = 400;
            throw error;
        }

        // 3. Creamos el objeto de datos COMPLETO para el servicio
        const datosCompletos = {
            ...datosDelBody, // Copiamos todos los campos de texto
            foto_cumpleaniero: req.file.filename, // Añadimos elnombre del archivo
            usuario_id: req.user.usuario_id
        };

        // 4. Llamamos al servicio con el objeto ya unificado
        const resultado = await servicioReservas.crearReserva(datosCompletos);
        
        res.status(201).json(resultado);
    } catch(err) {
        console.error("Error en crearReserva:", err.message);
        next(err); 
    }
}

// Controlador para cambiar la foto del cumpleañero


export const cambiarFotoCumpleaniero = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioAutenticado = req.user; // <-- Obtenemos el usuario del token
        
        if (!req.file) {
            return res.status(400).json({ msg: 'No se ha subido ningún archivo de imagen.' });
        }
        
        // Pasamos el ID, el archivo y el usuario al servicio
        const reservaActualizada = await servicioReservas.cambiarFoto(id, req.file, usuarioAutenticado);

        res.status(200).json({
            msg: 'La foto fue actualizada con éxito.',
            reserva: reservaActualizada,
        });
    } catch (error) {
        if (req.file) {
            await deleteImage(req.file.filename);
        }
        next(error);
    }
};