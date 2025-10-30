import express from 'express';
import * as controller from '../../controllers/ver1/controller_turnos.js'
import { validarTurno, validarIdTurno } from '../../midlewares/validators/turnosValidators.js';

const routerv1turnos = express.Router();

/**
 * @swagger
 * /api/ver1/turnos:
 *   get:
 *     summary: Obtener todos los turnos (con filtros opcionales)
 *     tags: [Turnos]
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
 *           enum: [id]
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
 *         description: Lista de turnos obtenida correctamente
 *       500:
 *         description: Error del servidor
 */


routerv1turnos.get('/', controller.mostrarTurnos);

/**
 * @swagger
 * /api/ver1/turnos/{id}:
 *   get:
 *     summary: Obtener un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a buscar
 *     responses:
 *       200:
 *         description: Turno encontrado correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1turnos.get('/:id', validarIdTurno, controller.mostrarTurnoPorId);

/**
 * @swagger
 * /api/ver1/turnos/{id}:
 *   put:
 *     summary: Actualizar un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a actualizar
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
 *         description: Turno actualizado correctamente
 *       400:
 *         description: Datos inválidos (errores de validación)
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1turnos.put('/:id', validarIdTurno, validarTurno, controller.updateTurno);

/**
 * @swagger
 * /api/ver1/turnos/{id}:
 *   delete:
 *     summary: Realizar baja lógica de un turno por ID
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a dar de baja
 *     responses:
 *       200:
 *         description: Turno marcado como inactivo correctamente
 *       400:
 *         description: El turno ya está inactivo
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1turnos.delete('/:id', validarIdTurno, controller.borrarTurno);

/**
 * @swagger
 * /api/ver1/turnos/{id}/reactivar:
 *   patch:
 *     summary: Reactivar un turno previamente dado de baja
 *     tags: [Turnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del turno a reactivar
 *     responses:
 *       200:
 *         description: Turno reactivado correctamente
 *       400:
 *         description: El turno ya está activo
 *       404:
 *         description: Turno no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1turnos.patch('/:id/reactivar', validarIdTurno,  controller.volverTurnoActivo);

/**
 * @swagger
 * /api/ver1/turnos/crear:
 *   post:
 *     summary: "Crear un nuevo turno"
 *     tags: [Turnos]
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
 *         description: "Turno creado correctamente"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Turno creado con éxito"
 *                 turno_id:
 *                   type: integer
 *                   example: 15
 *       "400":
 *         description: "Datos inválidos"
 *       "500":
 *         description: "Error del servidor"
 */

routerv1turnos.post('/crear', validarTurno, controller.nuevoTurno);

export default routerv1turnos;
