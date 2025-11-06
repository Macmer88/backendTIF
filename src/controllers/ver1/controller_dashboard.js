import * as dashboardService from '../../services/servicio_dashboard.js';
import createError from 'http-errors';

/**
 * Renderiza la vista de Facturación Mensual.
 */
export async function renderFacturacion(req, res, next) {
    try {
        // 1. Obtenemos SÓLO los datos de facturación
        const facturacionMensual = await dashboardService.obtenerEstadisticasFacturacion();

        // 2. Renderizamos la plantilla 'dashboard_facturacion.handlebars'
        res.render('dashboard_facturacion', {
            layout: 'admin',
            facturacion: facturacionMensual,
            usuario: req.user,
            // Le decimos a la vista qué link está activo (para el CSS)
            tituloPagina: 'Facturación Mensual'
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Renderiza la vista de Salones Populares.
 */
export async function renderSalonesPopulares(req, res, next) {
    try {
        // 1. Obtenemos SÓLO los datos de salones
        const salonesPopulares = await dashboardService.obtenerSalonesPopulares();

        // 2. Renderizamos la plantilla 'dashboard_salones.handlebars'
        res.render('dashboard_salones', {
            layout: 'admin',
            salones: salonesPopulares,
            usuario: req.user,
            // Le decimos a la vista qué link está activo (para el CSS)
            tituloPagina: 'Salones Populares'
        });

    } catch (error) {
        next(error);
    }
}

export async function renderServiciosPopulares(req, res, next) {
    try {
        const serviciosPopulares = await dashboardService.obtenerServiciosPopulares();

        res.render('dashboard_servicios', {
            layout: 'admin',
            servicios: serviciosPopulares,
            usuario: req.user,
            tituloPagina: 'Servicios Populares'
        });

    } catch (error) {
        next(error);
    }
}

export async function renderTurnosPopulares(req, res, next) {
    try {
        const turnosPopulares = await dashboardService.obtenerTurnosPopulares();

        res.render('dashboard_turnos', {
            layout: 'admin',
            turnos: turnosPopulares,
            usuario: req.user,
            tituloPagina: 'Turnos Populares'
        });

    } catch (error) {
        next(error);
    }
}


export async function renderDiasPopulares(req, res, next) {
    try {
        const { anio, mes } = req.query;
        
        const fechaActual = new Date();
        const anioActual = fechaActual.getFullYear();
        const mesActual = fechaActual.getMonth() + 1;

        const anioFiltro = anio ? parseInt(anio) : anioActual;
        const mesFiltro = mes ? parseInt(mes) : mesActual;

        const diasPopulares = await dashboardService.obtenerDiasPopulares(anioFiltro, mesFiltro);

        res.render('dashboard_dias', {
            layout: 'admin',
            dias: diasPopulares,
            usuario: req.user,
            
            filtros: {
                anio: anioFiltro,
                mes: mesFiltro
            },
            
            tituloPagina: 'Días Populares por Mes'
        });

    } catch (error) {
        next(error);
    }
}