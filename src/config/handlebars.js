

import { engine } from 'express-handlebars';

export default function setupHandlebars(app) {
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', './src/views');
}
