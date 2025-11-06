import express from 'express';
import passport from 'passport';
import { auditLoggerMiddleware } from '../../midlewares/global/logger.js';
import { esRol } from '../../midlewares/global/role_handler.js';
import * as controllerReportes from '../../controllers/ver1/controller_reportes.js';

const routerv1reportes = express.Router();

/**
 * @swagger
 * /api/ver1/reportes/reservas:
 *   get:
 *     summary: "Generar un reporte de reservas (Solo Admin)"
 *     description: "Obtiene un reporte detallado de reservas en formato PDF."
 *     tags: ["Reportes"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf]
 *         description: "El formato deseado para el reporte (pdf)."
 *     responses:
 *       "200":
 *         description: "El archivo del reporte se ha generado y enviado."
 *         content:
 *           application/pdf: {}
 *       "400":
 *         description: "Formato no válido."
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 *       "500":
 *         description: "Error del servidor."
 */
routerv1reportes.get(
    '/reservas',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    controllerReportes.obtenerReporteReservas
);

/**
 * @swagger
 * /api/ver1/reportes/facturacion:
 *   get:
 *     summary: "Generar un reporte de Facturación Mensual (Solo Admin)"
 *     description: "Obtiene las estadísticas de facturación en formato PDF."
 *     tags: ["Reportes"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf]
 *         description: "El formato deseado para el reporte (pdf)."
 *     responses:
 *       "200":
 *         description: "El archivo del reporte se ha generado y enviado."
 *         content:
 *           application/pdf: {}
 *       "400":
 *         description: "Formato no válido."
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 *       "500":
 *         description: "Error del servidor."
 */
routerv1reportes.get(
    '/facturacion',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    controllerReportes.obtenerReporteFacturacion
);

/**
 * @swagger
 * /api/ver1/reportes/salones:
 *   get:
 *     summary: "Generar un reporte de Salones Populares (Solo Admin)"
 *     description: "Obtiene las estadísticas de salones populares en formato PDF."
 *     tags: ["Reportes"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf]
 *         description: "El formato deseado para el reporte (pdf)."
 *     responses:
 *       "200":
 *         description: "El archivo del reporte se ha generado y enviado."
 *         content:
 *           application/pdf: {}
 *       "400":
 *         description: "Formato no válido."
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 *       "500":
 *         description: "Error del servidor."
 */
routerv1reportes.get(
    '/salones',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    controllerReportes.obtenerReporteSalones
);

/**
 * @swagger
 * /api/ver1/reportes/servicios:
 *   get:
 *     summary: "Generar un reporte de Servicios Populares (Solo Admin)"
 *     description: "Obtiene las estadísticas de servicios populares en formato PDF."
 *     tags: ["Reportes"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf]
 *         description: "El formato deseado para el reporte (pdf)."
 *     responses:
 *       "200":
 *         description: "El archivo del reporte se ha generado y enviado."
 *         content:
 *           application/pdf: {}
 *       "400":
 *         description: "Formato no válido."
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 *       "500":
 *         description: "Error del servidor."
 */
routerv1reportes.get(
    '/servicios',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    controllerReportes.obtenerReporteServicios
);

/**
 * @swagger
 * /api/ver1/reportes/turnos:
 *   get:
 *     summary: "Generar un reporte de Turnos Populares (Solo Admin)"
 *     description: "Obtiene las estadísticas de turnos populares en formato PDF."
 *     tags: ["Reportes"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf]
 *         description: "El formato deseado para el reporte (pdf)."
 *     responses:
 *       "200":
 *         description: "El archivo del reporte se ha generado y enviado."
 *         content:
 *           application/pdf: {}
 *       "400":
 *         description: "Formato no válido."
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 *       "500":
 *         description: "Error del servidor."
 */
routerv1reportes.get(
    '/turnos',
    passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    controllerReportes.obtenerReporteTurnos
);

export default routerv1reportes;