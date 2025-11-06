import * as controllerUsuariosver1 from '../../controllers/ver1/controller_usuarios.js';
import express from 'express';
import passport from 'passport';
import { auditLoggerMiddleware } from '../../midlewares/global/logger.js';
import { esRol } from '../../midlewares/global/role_handler.js';
import { uploadUsuario } from '../../config/multer.js';
import * as validator from '../../midlewares/validators/usuariosValidators.js';

const routerv1usuarios = express.Router();

/**
 * @swagger
 * /api/ver1/usuarios:
 *   get:
 *     summary: "Obtener todos los usuarios (con filtros opcionales)"
 *     tags: [Usuarios]
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
 *           enum: [usuario_id, nombre, apellido, tipo_usuario]
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
 *         description: "Lista de usuarios obtenida correctamente"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1usuarios.get('/', passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(2, 3),controllerUsuariosver1.mostrarUsuarios);

/**
 * @swagger
 * /api/ver1/usuarios/{id}:
 *   get:
 *     summary: "Obtener un usuario por ID"
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID del usuario"
 *     responses:
 *       "200":
 *         description: "Usuario obtenido correctamente"
 *       "404":
 *         description: "Usuario no encontrado"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1usuarios.get('/:id', 
    passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(2, 3),
    validator.validarIdUsuario,
    controllerUsuariosver1.mostrarUsuarioPorId);

/**
 * @swagger
 * /api/ver1/usuarios/{id}:
 *   delete:
 *     summary: "Soft delete de un usuario por ID"
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID del usuario"
 *     responses:
 *       "200":
 *         description: "Usuario eliminado correctamente"
 *       "404":
 *         description: "Usuario no encontrado"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1usuarios.delete('/:id',
    passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    validator.validarIdUsuario,
    controllerUsuariosver1.eliminarUsuario);

/**
 * @swagger
 * /api/ver1/usuarios/{id}/reactivar:
 *   patch:
 *     summary: "Reactivar un usuario por ID"
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID del usuario"
 *     responses:
 *       "200":
 *         description: "Usuario reactivado correctamente"
 *       "404":
 *         description: "Usuario no encontrado"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1usuarios.patch('/:id/reactivar',
    passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    validator.validarIdUsuario,
    controllerUsuariosver1.reactivarUsuario);

/**
 * @swagger
 * /api/ver1/usuarios/{id}:
 *   put:
 *     summary: "Actualizar un usuario por ID"
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID del usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               tipo_usuario:
 *                 type: string
 *               celular:
 *                 type: string
 *     responses:
 *       "200":
 *         description: "Usuario actualizado correctamente"
 *       "400":
 *         description: "Faltan campos obligatorios"
 *       "404":
 *         description: "Usuario no encontrado"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1usuarios.put('/:id',
    passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    validator.validarIdUsuario,
    validator.validarActualizacionUsuario,
    controllerUsuariosver1.actualizarUsuario);

/**
 * @swagger
 * /api/ver1/usuarios/crear:
 *   post:
 *     summary: "Crear un nuevo usuario"
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *               tipo_usuario:
 *                 type: number
 *               celular:
 *                 type: number
 *     responses:
 *       "201":
 *         description: "Usuario creado correctamente"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1usuarios.post('/crear',
    passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    uploadUsuario.single('foto'),
    validator.validarNuevoUsuario,
    controllerUsuariosver1.nuevoUsuario);

/**
 * @swagger
 * /api/ver1/usuarios/{id}/foto:
 *   patch:
 *     summary: "Cambiar la foto de un usuario por ID"
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: "ID del usuario"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: "Nueva foto del usuario"
 *     responses:
 *       "200":
 *         description: "Foto del usuario actualizada correctamente"
 *       "400":
 *         description: "No se proporcionó una foto"
 *       "404":
 *         description: "Usuario no encontrado"
 *       "500":
 *         description: "Error del servidor"
 */
routerv1usuarios.patch('/:id/foto',
    passport.authenticate('jwt',
    { session: false }),
    auditLoggerMiddleware,
    esRol(3),
    uploadUsuario.single('foto'),
    validator.validarIdUsuario,
    controllerUsuariosver1.cambiarFotoUsuario);

export default routerv1usuarios;