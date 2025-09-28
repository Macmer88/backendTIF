import express from 'express';
import { mostrarSalones } from '../../controllers/ver1/controller_salonesv1.js';
import { mostrarSalonPorId } from '../../controllers/ver1/controller_salonesv1.js';
const routerv1 = express.Router();
routerv1.get('/', mostrarSalones);
routerv1.get('/:id', mostrarSalonPorId);

export default routerv1;
