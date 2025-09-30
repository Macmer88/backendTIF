import express from 'express';
import { mostrarSalones } from '../../controllers/ver1/controller_salonesv1.js';
import { mostrarSalonPorId, updateSalon } from '../../controllers/ver1/controller_salonesv1.js';
const routerv1 = express.Router();
routerv1.get('/', mostrarSalones);
routerv1.get('/:id', mostrarSalonPorId);
routerv1.put('/:id', updateSalon);

export default routerv1;
