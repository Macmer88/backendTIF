import express from 'express';
import setupHandlebars from './src/config/handlebars.js';
import routerv1salones from './src/routes/ver1/routes_salonv1.js';
import routerv2salones from './src/routes/ver2/routes_salon.js';
import routerv1usuarios from './src/routes/ver1/routes_usuariosver1.js';
import routerv1reservas from './src/routes/ver1/routes_reservasv1.js';
import corsMiddleware from './src/midlewares/global/corsconfig.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/docs/swaggerConfig.js';
import helmet from 'helmet';
import logger from './src/midlewares/global/logger.js';
import notFound from './src/midlewares/global/notFound.js';
import errorHandler from './src/midlewares/global/errorHandler.js';

const app = express();
const port = 3000;
setupHandlebars(app);

app.use(corsMiddleware);
app.use(express.json());
app.use(logger);


app.use(express.static('src/public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet());
app.use('/api/ver1/salones', routerv1salones);
app.use('/api/ver1/reservas', routerv1reservas);
app.use('/api/ver1/usuarios', routerv1usuarios);

app.use('/api/ver2/salones', routerv2salones);

app.use(notFound);

app.use(errorHandler);


app.listen(port, () => {
    console.log(`escuchando en http://localhost:${port}`);
});
