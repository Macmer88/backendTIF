import express from 'express';
import passport from 'passport';
import { esRol } from '../../midlewares/global/role_handler.js';
import { auditLoggerMiddleware } from '../../midlewares/global/logger.js';
import { renderFacturacion, renderSalonesPopulares, renderServiciosPopulares, renderTurnosPopulares, renderDiasPopulares } from '../../controllers/ver1/controller_dashboard.js';

const routerv1dashboard = express.Router();


/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: "Renderiza el dashboard de estadísticas (Solo Admin, Vista HTML)"
 *     description: "Esta ruta no devuelve JSON, renderiza una vista Handlebars."
 *     tags: ["Dashboard (Vistas)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "El dashboard HTML renderizado."
 *         content:
 *           text/html: {}
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 */
routerv1dashboard.get('/',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    renderFacturacion
);

/**
 * @swagger
 * /dashboard/salones:
 *   get:
 *     summary: "Renderiza el reporte de Salones Populares (Solo Admin, Vista HTML)"
 *     description: "Esta ruta no devuelve JSON, renderiza una vista Handlebars con salones populares."
 *     tags: ["Dashboard (Vistas)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "El reporte HTML renderizado."
 *         content:
 *           text/html: {}
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 */
routerv1dashboard.get('/salones',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    renderSalonesPopulares
);

/**
 * @swagger
 * /dashboard/servicios:
 *   get:
 *     summary: "Renderiza el reporte de Servicios Populares (Solo Admin, Vista HTML)"
 *     description: "Esta ruta no devuelve JSON, renderiza una vista Handlebars con servicios populares."
 *     tags: ["Dashboard (Vistas)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "El reporte HTML renderizado."
 *         content:
 *           text/html: {}
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 */
routerv1dashboard.get('/servicios',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    renderServiciosPopulares
);


/**
 * @swagger
 * /dashboard/turnos:
 *   get:
 *     summary: "Renderiza el reporte de Turnos Populares (Solo Admin, Vista HTML)"
 *     description: "Esta ruta no devuelve JSON, renderiza una vista Handlebars con turnos populares."
 *     tags: ["Dashboard (Vistas)"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: "El reporte HTML renderizado."
 *         content:
 *           text/html: {}
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 */
routerv1dashboard.get('/turnos',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    renderTurnosPopulares
);


/**
 * @swagger
 * /dashboard/dias:
 *   get:
 *     summary: "Renderiza el reporte de Días Populares (Solo Admin, Vista HTML)"
 *     description: "Acepta ?anio=YYYY&mes=MM para filtrar."
 *     tags: ["Dashboard (Vistas)"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *         description: "Filtrar por año (ej: 2025)"
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *         description: "Filtrar por mes (1-12)"
 *     responses:
 *       "200":
 *         description: "El reporte HTML renderizado."
 *         content:
 *           text/html: {}
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 */
routerv1dashboard.get('/dias',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    renderDiasPopulares
);


export default routerv1dashboard;



