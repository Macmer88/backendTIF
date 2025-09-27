import express from 'express';
import { renderSalonesView } from '../../controllers/ver2/controller_salones.js';

const routerv2 = express.Router();
routerv2.get('/', renderSalonesView);

export default routerv2;
