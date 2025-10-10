import express from 'express';
import { renderSalonesView } from '../../controllers/ver2/controller_salones.js';

const routerv2salones = express.Router();
routerv2salones.get('/', renderSalonesView);

export default routerv2salones;
