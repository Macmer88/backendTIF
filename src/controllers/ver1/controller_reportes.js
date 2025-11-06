import * as servicioReportes from '../../services/servicio_reportes.js';
import createError from 'http-errors';
import * as dashboardService from '../../services/servicio_dashboard.js';

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

/**
 * Genera un reporte (PDF/CSV) de la Facturación Mensual.
 */
export async function obtenerReporteFacturacion(req, res, next) {
    const { formato } = req.query;

    try {
        // 1. Obtenemos los datos (¡Reutilizamos el servicio del dashboard!)
        const datos = await dashboardService.obtenerEstadisticasFacturacion();

        // 2. Decidimos qué generador usar (del servicio de reportes)
        if (formato === 'csv') {
            await servicioReportes.generarCSVFacturacion(datos, res);
        } else if (formato === 'pdf') {
            await servicioReportes.generarPDFFacturacion(datos, res);
        } else {
            throw createError(400, "Formato de reporte no válido. Use 'pdf' o 'csv'.");
        }

    } catch (error) {
        next(error);
    }
}

/**
 * Genera un reporte (PDF/CSV) de los Salones Populares.
 */
export async function obtenerReporteSalones(req, res, next) {
    try {
        // 1. Obtenemos los datos (¡Reutilizamos el servicio del dashboard!)
        const datos = await dashboardService.obtenerSalonesPopulares();

        // 2. Decidimos qué generador usar
        if (req.query.formato === 'csv') {
            await servicioReportes.generarCSVSalones(datos, res);
        } else if (req.query.formato === 'pdf') {
            await servicioReportes.generarPDFSalones(datos, res);
        } else {
            throw createError(400, "Formato de reporte no válido. Use 'pdf' o 'csv'.");
        }

    } catch (error) {
        next(error);
    }
}

/**
 * Genera un reporte (PDF/CSV) de los Servicios Populares.
 */
export async function obtenerReporteServicios(req, res, next) {
    try {
        // 1. Obtenemos los datos (¡Reutilizamos el servicio del dashboard!)
        const datos = await dashboardService.obtenerServiciosPopulares();

        // 2. Decidimos qué generador usar
        if (req.query.formato === 'csv') {
            await servicioReportes.generarCSVServicios(datos, res);
        } else if (req.query.formato === 'pdf') {
            await servicioReportes.generarPDFServicios(datos, res);
        } else {
            throw createError(400, "Formato de reporte no válido. Use 'pdf' o 'csv'.");
        }

    } catch (error) {
        next(error);
    }
}

/**
 * Genera un reporte (PDF/CSV) de los Turnos Populares.
 */
export async function obtenerReporteTurnos(req, res, next) {
    try {
        // 1. Obtenemos los datos (¡Reutilizamos el servicio del dashboard!)
        const datos = await dashboardService.obtenerTurnosPopulares();

        // 2. Decidimos qué generador usar
        if (req.query.formato === 'csv') {
            await servicioReportes.generarCSVTurnos(datos, res);
        } else if (req.query.formato === 'pdf') {
            await servicioReportes.generarPDFTurnos(datos, res);
        } else {
            throw createError(400, "Formato de reporte no válido. Use 'pdf' o 'csv'.");
        }

    } catch (error) {
        next(error);
    }
}