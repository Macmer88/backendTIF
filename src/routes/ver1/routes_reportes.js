import express from 'express';
import passport from 'passport';
import { esRol } from '../../midlewares/global/role_handler.js';
import * as controllerReportes from '../../controllers/ver1/controller_reportes.js';

const routerv1reportes = express.Router();

/**
 * @swagger
 * /api/ver1/reportes/reservas:
 *   get:
 *     summary: "Generar un reporte de reservas (Solo Admin)"
 *     description: "Obtiene un reporte detallado de reservas en formato PDF o CSV."
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf, csv]
 *         description: "El formato deseado para el reporte (pdf o csv)."
 *     responses:
 *       "200":
 *         description: "El archivo del reporte se ha generado y enviado."
 *         content:
 *           application/pdf: {}
 *           text/csv: {}
 *       "400":
 *         description: "Formato no válido."
 *       "401":
 *         description: "No autorizado (token inválido)."
 *       "403":
 *         description: "Acceso denegado (no es Admin)."
 *       "500":
 *         description: "Error del servidor."
 */
routerv1reportes.get('/reservas',
    passport.authenticate('jwt', { session: false }),
    esRol(3),
    controllerReportes.obtenerReporteReservas
);

export default routerv1reportes;