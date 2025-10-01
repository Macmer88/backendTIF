import express from 'express';
import { mostrarSalones } from '../../controllers/ver1/controller_salonesv1.js';
import { mostrarSalonPorId, updateSalon, borrarSalon, volverSalonActivo, nuevoSalon } from '../../controllers/ver1/controller_salonesv1.js';
const routerv1 = express.Router();
routerv1.get('/', mostrarSalones);
routerv1.get('/:id', mostrarSalonPorId);
routerv1.put('/:id', updateSalon);
routerv1.delete('/:id', borrarSalon);
routerv1.patch('/:id/reactivar', volverSalonActivo);
routerv1.post('/crear', nuevoSalon);

export default routerv1;
