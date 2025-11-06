

import { engine } from 'express-handlebars';
import path from 'path';

/*
export default function setupHandlebars(app) {
    app.engine('handlebars', engine());
    app.set('view engine', 'handlebars');
    app.set('views', './src/views');
}
*/

// Helper de Handlebars para comparación de igualdad
const customHelpers = {
    /**
     * Helper de Handlebars para comparar si dos valores son iguales.
     * Uso: {{#if (eq valor1 valor2)}} ... {{/if}}
     */
    eq: (a, b) => a === b,
};

export default function setupHandlebars(app) {
    // 1. Configuración completa (usando 'engine' para registrar el helper)
    const hbs = engine({
        extname: '.handlebars',
        // Registramos el objeto de helpers aquí
        helpers: customHelpers,
        // Configuramos la carpeta de layouts (asumiendo que está en src/views/layouts)
        layoutsDir: path.resolve(process.cwd(), 'src/views/layouts'),
        // Configuramos la carpeta de partials (asumiendo que está en src/views/partials)
        partialsDir: path.resolve(process.cwd(), 'src/views/partials'),
        // Layout principal que usaste en los controladores
        defaultLayout: 'admin', 
    });

    // 2. Le decimos a Express que use este motor
    app.engine('handlebars', hbs);
    
    // 3. Le decimos a Express que la extensión es 'handlebars'
    app.set('view engine', 'handlebars');
    
    // 4. Le decimos a Express dónde están las vistas (tu configuración original)
    app.set('views', path.resolve(process.cwd(), 'src/views'));
}