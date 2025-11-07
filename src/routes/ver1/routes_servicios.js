import express from 'express';
import passport from 'passport';
import { auditLoggerMiddleware } from '../../midlewares/global/logger.js';
import { esRol } from '../../midlewares/global/role_handler.js';
import * as controller from '../../controllers/ver1/controller_servicios.js'
import { validarServicio, validarIdServicio } from '../../midlewares/validators/serviciosValidators.js';

const routerv1servicios = express.Router();

/**
 * @swagger
 * /api/ver1/servicios:
 *   get:
 *     summary: Obtener todos los servicios (con filtros opcionales)
 *     tags: [Servicios]
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: Filtrar por estado activo (1 = activo, 0 = inactivo)
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [id, importe, descripcion]
 *         description: Campo por el cual ordenar los resultados
 *       - in: query
 *         name: desc
 *         schema:
 *           type: boolean
 *         description: Orden descendente si es true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad máxima de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Desplazamiento para paginación
 *       - in: query
 *         name: buscar
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar por descripción
 *     responses:
 *       200:
 *         description: Lista de servicios obtenida correctamente
 *       500:
 *         description: Error del servidor
 */


routerv1servicios.get('/', passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(1, 2, 3),
    controller.mostrarServicios);

/**
 * @swagger
 * /api/ver1/servicios/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio a buscar
 *     responses:
 *       200:
 *         description: Servicio encontrado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1servicios.get('/:id', passport.authenticate('jwt', { session: false }),
    auditLoggerMiddleware,
    esRol(1, 2, 3),validarIdServicio,
    controller.mostrarServicioPorId);

/**
 * @swagger
 * /api/ver1/servicios/{id}:
 *   put:
 *     summary: Actualizar un servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               importe:
 *                 type: number
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 *       400:
 *         description: Datos inválidos (errores de validación)
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1servicios.put('/:id', passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(2, 3),
    validarIdServicio, validarServicio, controller.updateServicio);

/**
 * @swagger
 * /api/ver1/servicios/{id}:
 *   delete:
 *     summary: Realizar baja lógica de un servicio por ID
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio a dar de baja
 *     responses:
 *       200:
 *         description: Servicio marcado como inactivo correctamente
 *       400:
 *         description: El servicio ya está inactivo
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1servicios.delete('/:id', passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(2, 3),
    validarIdServicio, controller.borrarServicio);

/**
 * @swagger
 * /api/ver1/servicios/{id}/reactivar:
 *   patch:
 *     summary: Reactivar un servicio previamente dado de baja
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del servicio a reactivar
 *     responses:
 *       200:
 *         description: Servicio reactivado correctamente
 *       400:
 *         description: El servicio ya está activo
 *       404:
 *         description: Servicio no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1servicios.patch('/:id/reactivar', passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(2, 3),
    validarIdServicio,  controller.volverServicioActivo);

/**
 * @swagger
 * /api/ver1/servicios/crear:
 *   post:
 *     summary: "Crear un nuevo servicio"
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - descripcion
 *               - importe
 *             properties:
 *               descripcion:
 *                 type: string
 *               importe:
 *                 type: number
 *     responses:
 *       "201":
 *         description: "Servicio creado correctamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Servicio creado con éxito"
 *                 servicio_id:
 *                   type: integer
 *                   example: 15
 *       "400":
 *         description: "Datos inválidos"
 *       "500":
 *         description: "Error del servidor"
 */

routerv1servicios.post('/crear', passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(2, 3),validarServicio, controller.nuevoServicio);

export default routerv1servicios;


