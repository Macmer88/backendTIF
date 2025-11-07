import express from 'express';
import passport from 'passport';
import { esRol } from '../../midlewares/global/role_handler.js';
import * as dashboardService from '../../services/servicio_dashboard.js';
import { auditLoggerMiddleware } from '../../midlewares/global/logger.js';

const routerv1stats = express.Router();

const authAndAdmin = [
    passport.authenticate('jwt', { session: false }),
    esRol(3)
];

/**
 * @swagger
 * /api/ver1/stats/facturacion:
 *   get:
 *     summary: "Obtiene la facturación mensual"
 *     tags: ["Estadisticas (JSON)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "Facturación obtenida correctamente"
 */
routerv1stats.get(
    '/facturacion',
    authAndAdmin,
    auditLoggerMiddleware,
    async (req, res, next) => {
        try {
            const data = await dashboardService.obtenerEstadisticasFacturacion();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /api/ver1/stats/salones:
 *   get:
 *     summary: "Obtiene el Top 5 Salones"
 *     tags: ["Estadisticas (JSON)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "Top Salones obtenido correctamente"
 */
routerv1stats.get(
    '/salones',
    authAndAdmin,
    auditLoggerMiddleware,
    async (req, res, next) => {
        try {
            const data = await dashboardService.obtenerSalonesPopulares();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /api/ver1/stats/servicios:
 *   get:
 *     summary: "Obtiene el Top 5 Servicios (JSON)"
 *     tags: ["Estadisticas (JSON)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "Top Servicios obtenido correctamente"
 */
routerv1stats.get(
    '/servicios',
    authAndAdmin,
    auditLoggerMiddleware,
    async (req, res, next) => {
        try {
            const data = await dashboardService.obtenerServiciosPopulares();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /api/ver1/stats/turnos:
 *   get:
 *     summary: "Obtiene el ranking de Turnos (JSON)"
 *     tags: ["Estadisticas (JSON)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "Ranking de turnos obtenido correctamente"
 */
routerv1stats.get(
    '/turnos',
    authAndAdmin,
    auditLoggerMiddleware,
    async (req, res, next) => {
        try {
            const data = await dashboardService.obtenerTurnosPopulares();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * @swagger
 * /api/ver1/stats/dias:
 *   get:
 *     summary: "Obtiene los días más populares por Mes/Año (JSON)"
 *     tags: ["Estadisticas (JSON)"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *         description: "Año a filtrar (ej: 2025)"
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *         description: "Mes a filtrar (1-12)"
 *     responses:
 *       "200":
 *         description: "Días populares obtenidos correctamente"
 */
routerv1stats.get(
    '/dias',
    authAndAdmin,
    auditLoggerMiddleware,
    async (req, res, next) => {
        try {
            const { anio, mes } = req.query;

            // Valores por defecto
            const fechaActual = new Date();
            const anioActual = fechaActual.getFullYear();
            const mesActual = fechaActual.getMonth() + 1;

            const anioFiltro = anio ? parseInt(anio, 10) : anioActual;
            const mesFiltro = mes ? parseInt(mes, 10) : mesActual;

            const data = await dashboardService.obtenerDiasPopulares(anioFiltro, mesFiltro);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
);

export default routerv1stats;