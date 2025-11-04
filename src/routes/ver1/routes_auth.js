import express from 'express';
import passport from 'passport';
import * as authController from '../../controllers/ver1/controller_auth.js';
import { validarLogin } from '../../midlewares/validators/authValidators.js';

const routerv1auth = express.Router();

/**
 * @swagger
 * /api/ver1/auth/login:
 *   post:
 *     summary: "Iniciar sesión y obtener un token JWT"
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_usuario
 *               - contrasenia
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *                 example: "admin"
 *               contrasenia:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       "200":
 *         description: "Login exitoso. Devuelve el token y datos del usuario."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Login exitoso"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 usuario:
 *                   type: object
 *       "400":
 *         description: "Datos inválidos (ej: falta contraseña)"
 *       "401":
 *         description: "No autorizado (Usuario no encontrado o contraseña incorrecta)"
 */
routerv1auth.post(
    '/login',
    validarLogin, 
    passport.authenticate('local', { session: false }),
    authController.login
);

export default routerv1auth;