import express from 'express';
import setupHandlebars from './src/config/handlebars.js';
import routerv1 from './src/routes/ver1/routes_salonv1.js';
import routerv2 from './src/routes/ver2/routes_salon.js';
import corsMiddleware from './src/midlewares/corsconfig.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/docs/swaggerConfig.js';
import helmet from 'helmet';


const app = express();
const port = 3000;
setupHandlebars(app);

app.use(corsMiddleware);
app.use(express.json());


app.use(express.static('src/public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(helmet());
app.use('/api/ver1/salones', routerv1);
app.use('/api/ver2/salones', routerv2);


app.listen(port, () => {
    console.log(`escuchando en http://localhost:${port}`);
});
