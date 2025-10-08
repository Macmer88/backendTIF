import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API PROGIII',
        version: '1.0.0',
        description: 'Documentación de la API para el proyecto PROGIII',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor local',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/ver1/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);

