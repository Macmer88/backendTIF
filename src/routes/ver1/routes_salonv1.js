import express from 'express';
import { mostrarSalones } from '../../controllers/ver1/controller_salonesv1.js';
import { mostrarSalonPorId, updateSalon, borrarSalon, volverSalonActivo, nuevoSalon } from '../../controllers/ver1/controller_salonesv1.js';
import { validarSalones, validarIdSalon } from '../../midlewares/validators/salonesValidators.js';
import { verificarSalonExistente } from '../../midlewares/specifics/midlewareSalones.js';
const routerv1salones = express.Router();

/**
 * @swagger
 * /api/ver1/salones:
 *   get:
 *     summary: Obtener todos los salones (con filtros opcionales)
 *     tags: [Salones]
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
 *           enum: [capacidad, importe, titulo]
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
 *     responses:
 *       200:
 *         description: Lista de salones obtenida correctamente
 *       500:
 *         description: Error del servidor
 */


routerv1salones.get('/', mostrarSalones);

/**
 * @swagger
 * /api/ver1/salones/{id}:
 *   get:
 *     summary: Obtener un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del salón a buscar
 *     responses:
 *       200:
 *         description: Salón encontrado correctamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1salones.get('/:id', validarIdSalon,mostrarSalonPorId);

/**
 * @swagger
 * /api/ver1/salones/{id}:
 *   put:
 *     summary: Actualizar un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del salón a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *               importe:
 *                 type: number
 *     responses:
 *       200:
 *         description: Salón actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Salón no encontrado
 *       409:
 *         description: Ya existe un salón activo con ese título
 *       500:
 *         description: Error del servidor
 */

routerv1salones.put('/:id', validarIdSalon,validarSalones, updateSalon);

/**
 * @swagger
 * /api/ver1/salones/{id}:
 *   delete:
 *     summary: Realizar baja lógica de un salón por ID
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del salón a dar de baja
 *     responses:
 *       200:
 *         description: Salón marcado como inactivo correctamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1salones.delete('/:id', validarIdSalon,borrarSalon);

/**
 * @swagger
 * /api/ver1/salones/{id}/reactivar:
 *   patch:
 *     summary: Reactivar un salón previamente dado de baja
 *     tags: [Salones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del salón a reactivar
 *     responses:
 *       200:
 *         description: Salón reactivado correctamente
 *       404:
 *         description: Salón no encontrado
 *       500:
 *         description: Error del servidor
 */

routerv1salones.patch('/:id/reactivar', validarIdSalon, verificarSalonExistente, volverSalonActivo);

/**
 * @swagger
 * /api/ver1/salones/crear:
 *   post:
 *     summary: Crear un nuevo salón
 *     tags: [Salones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - direccion
 *               - capacidad
 *               - importe
 *             properties:
 *               titulo:
 *                 type: string
 *               direccion:
 *                 type: string
 *               capacidad:
 *                 type: integer
 *               importe:
 *                 type: number
 *     responses:
 *       201:
 *         description: Salón creado correctamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Ya existe un salón activo con ese título
 *       500:
 *         description: Error del servidor
 */

routerv1salones.post('/crear', validarSalones, verificarSalonExistente, nuevoSalon);

export default routerv1salones;
