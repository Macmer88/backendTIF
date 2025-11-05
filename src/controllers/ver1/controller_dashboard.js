import * as dashboardService from '../../services/servicio_dashboard.js';
import createError from 'http-errors';

/**
 * Renderiza la vista principal del Dashboard del Admin
 * con datos de los Stored Procedures.
 */
export async function renderDashboard(req, res, next) {
    try {
        // 1. Obtenemos los datos de facturación
        // (Llamamos al servicio que creamos en el paso anterior)
        const facturacionMensual = await dashboardService.obtenerEstadisticasFacturacion();

        // 2. (Aquí llamaremos a futuros servicios: salones populares, etc.)
        // const salonesPopulares = await dashboardService.obtenerSalonesPopulares();

        // 3. Renderizamos la plantilla 'dashboard.hbs'
        // y le pasamos los datos para que los use.
        res.render('dashboard', {
            layout: 'admin', // Usaremos un layout principal llamado 'admin.hbs'
            facturacion: facturacionMensual,
            // salones: salonesPopulares,

            // Pasamos los datos del usuario logueado (del token)
            // para poder mostrar (ej: "Bienvenido, Admin")
            usuario: req.user 
        });

    } catch (error) {
        next(error);
    }
}