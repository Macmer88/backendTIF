import express from 'express';
import setupHandlebars from './src/config/handlebars.js';
import salonRouter from './src/routes/routes_salon.js';

const app = express();
const port = 3000;
setupHandlebars(app);
app.use(express.static('src/public'));
app.use('/salones', salonRouter);




app.listen(port, () => {
    console.log(`escuchando en http://localhost:${port}`);
});
