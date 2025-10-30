import * as controladoresReservas from '../../controllers/ver1/controller_reservas.js';
import * as validatorsReservas from '../../midlewares/validators/reservasValidators.js';
import * as midlewareReservas from '../../midlewares/specifics/midlewareReservas.js';
import { uploadCumpleanero } from '../../config/multer.js';
import express from 'express';
const routerv1reservas = express.Router();

/**
 * @swagger
 * /api/ver1/reservas:
 *   get:
 *     summary: "Obtener todas las reservas (con filtros opcionales)"
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *         description: "Filtrar por estado activo (1 = activo, 0 = inactivo)"
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [reserva_id, importe, fecha_reserva, creado, importe_total]
 *         description: "Campo por el cual ordenar los resultados"
 *       - in: query
 *         name: desc
 *         schema:
 *           type: boolean
 *         description: "Orden descendente si es true"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Cantidad máxima de resultados"
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: "Desplazamiento para paginación"
 *     responses:
 *       "200":
 *         description: "Lista de reservas obtenida correctamente"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1reservas.get('/', controladoresReservas.mostrarReservas);

/**
 * @swagger
 * /api/ver1/reservas/{id}:
 *   get:
 *     summary: "Obtener una reserva por ID"
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de la reserva a buscar"
 *     responses:
 *       "200":
 *         description: "Reserva encontrada correctamente"
 *       "404":
 *         description: "Reserva no encontrada"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1reservas.get('/:id', controladoresReservas.mostrarReservasPorId);

/**
 * @swagger
 * /api/ver1/reservas/{id}:
 *   put:
 *     summary: "Actualizar una reserva por ID"
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de la reserva a actualizar"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *               salon_id:
 *                 type: integer
 *               turno_id:
 *                 type: integer
 *               importe_total:
 *                 type: number
 *     responses:
 *       "200":
 *         description: "Reserva actualizada correctamente"
 *       "400":
 *         description: "Datos inválidos"
 *       "404":
 *         description: "Reserva no encontrada"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1reservas.put('/:id', validatorsReservas.validarIdReserva, validatorsReservas.validarReservas, controladoresReservas.updateReserva);

/**
 * @swagger
 * /api/ver1/reservas/{id}:
 *   delete:
 *     summary: "Realizar baja lógica de una reserva por ID"
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de la reserva a dar de baja"
 *     responses:
 *       "200":
 *         description: "Reserva marcada como inactiva correctamente"
 *       "404":
 *         description: "Reserva no encontrada"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1reservas.delete('/:id', validatorsReservas.validarIdReserva, controladoresReservas.borrarReserva);

/**
 * @swagger
 * /api/ver1/reservas/{id}/reactivar:
 *   patch:
 *     summary: "Reactivar una reserva previamente dada de baja"
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de la reserva a reactivar"
 *     responses:
 *       "200":
 *         description: "Reserva reactivada correctamente"
 *       "404":
 *         description: "Reserva no encontrada"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1reservas.patch('/:id/reactivar', validatorsReservas.validarIdReserva, controladoresReservas.volverReservaActiva);

/**
 * @swagger
 * /api/ver1/reservas/crear:
 *   post:
 *     summary: "Crear una nueva reserva"
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fecha_reserva
 *               - salon_id
 *               - usuario_id
 *               - turno_id
 *               - foto_cumpleaniero
 *               - tematica
 *               - importe_total
 *             properties:
 *               fecha_reserva:
 *                 type: string
 *                 format: date
 *                 description: "Fecha en YYYY-MM-DD. Reglas: no pasada, min 72h, max 6 meses."
 *                 example: "2025-12-25"
 *               salon_id:
 *                 type: integer
 *                 description: "ID de un salón existente y activo."
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 description: "ID de un usuario existente y activo."
 *                 example: 2
 *               turno_id:
 *                 type: integer
 *                 description: "ID de un turno existente y activo."
 *                 example: 3
 *               foto_cumpleaniero:
 *                 type: string
 *                 format: binary
 *                 description: "Foto del cumpleañero (opcional)."
 *               tematica:
 *                 type: string
 *                 description: "Temática de la fiesta."
 *                 example: "Superhéroes"
 *               importe_total:
 *                 type: number
 *                 description: "Importe (por ahora manual)."
 *                 example: 15000
 *     responses:
 *       "201":
 *         description: "Reserva creada correctamente"
 *       "400":
 *         description: "Datos inválidos (Errores de validación)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errores:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: "field"
 *                       value:
 *                         type: string
 *                         example: "999"
 *                       msg:
 *                         type: string
 *                         example: "El salón seleccionado no existe o no está disponible."
 *                       path:
 *                         type: string
 *                         example: "salon_id"
 *                       location:
 *                         type: string
 *                         example: "body"
 *       "409":
 *         description: "El salón ya está ocupado"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "El salón no está disponible en la fecha y turno seleccionados"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1reservas.post('/crear', uploadCumpleanero.single('foto_cumpleaniero'), validatorsReservas.validarReservas, midlewareReservas.estaDisponible, controladoresReservas.nuevaReserva);

/**
 * @swagger
 * /api/ver1/reservas/foto/{id}:
 *   patch:
 *     summary: "Actualizar solo la foto de una reserva"
 *     description: "Actualiza la foto del cumpleañero. La foto anterior será eliminada."
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID de la reserva a la cual cambiar la foto"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - foto_cumpleaniero
 *             properties:
 *               foto_cumpleaniero:
 *                 type: string
 *                 format: binary
 *                 description: "Nueva foto del cumpleañero"
 *     responses:
 *       "200":
 *         description: "Foto actualizada correctamente"
 *       "400":
 *         description: "No se ha subido ningún archivo o el formato no es válido"
 *       "404":
 *         description: "Reserva no encontrada"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1reservas.patch('/foto/:id', validatorsReservas.validarIdReserva, uploadCumpleanero.single('foto_cumpleaniero'), controladoresReservas.cambiarFotoCumpleaniero);

export default routerv1reservas;



