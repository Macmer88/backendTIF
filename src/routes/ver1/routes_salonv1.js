import express from 'express';
import { renderSalonesJson } from '../../controllers/ver1/controller_salonesv1.js';

const routerv1 = express.Router();
routerv1.get('/', renderSalonesJson);

export default routerv1;
