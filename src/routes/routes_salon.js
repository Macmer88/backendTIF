import express from 'express';
import { renderSalonesView } from '../controllers/controller_salones.js';

const router = express.Router();
router.get('/', renderSalonesView);

export default router;
