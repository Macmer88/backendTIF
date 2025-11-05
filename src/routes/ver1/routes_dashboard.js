import express from 'express';
import passport from 'passport';
import { esRol } from '../../midlewares/global/role_handler.js';
import * as dashboardController from '../../controllers/ver1/controller_dashboard.js';

const routerv1dashboard = express.Router();

// NOTA: La ruta base será definida en app.js (ej: /dashboard)

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
    passport.authenticate('jwt', { session: false }), // 1. ¿Logueado?
    esRol(3),                                       // 2. Solo Admin (Rol 3)
    dashboardController.renderDashboard             // 3. Renderiza la vista
);

export default routerv1dashboard;