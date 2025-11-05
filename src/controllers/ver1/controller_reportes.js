import * as servicioReportes from '../../services/servicio_reportes.js';
import createError from 'http-errors';

export async function obtenerReporteReservas(req, res, next) {
    // Obtenemos el formato deseado del query string (pdf o csv)
    const { formato } = req.query;

    try {
        // 1. Obtenemos los datos crudos de la BD
        const datos = await servicioReportes.obtenerDatosReporte();

        // 2. Decidimos qué generador usar
        if (formato === 'csv') {
            // El servicio se encarga de enviar la respuesta
            await servicioReportes.generarReporteCSV(datos, res);

        } else if (formato === 'pdf') {
            // El servicio se encarga de enviar la respuesta
            await servicioReportes.generarReportePDF(datos, res);

        } else {
            // Si no especifican un formato válido
            throw createError(400, "Formato de reporte no válido. Use 'pdf' o 'csv'.");
        }

    } catch (error) {
        next(error);
    }
}