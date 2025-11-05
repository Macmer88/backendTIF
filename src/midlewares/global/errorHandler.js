import { errorLogger } from './logger.js'; 

// Este middleware captura cualquier error que ocurra en rutas o middlewares
const errorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const path = req.originalUrl;
    const method = req.method;

    errorLogger.error({
        timestamp: timestamp,
        method: method,
        path: path,
        errorName: err.name,
        errorMessage: err.message,
        stack: err.stack, 
        statusCode: err.statusCode || err.status || 500
    });

    // Manejo de errores de validación (express-validator)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Error de validación',
            details: err.details || err.message,
        });
    }

    // Manejo de errores de autenticación (token faltante o inválido)
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'No autorizado',
            message: err.message,
        });
    }

    // Manejo de errores de conflicto de datos (por ejemplo, duplicados en base de datos)
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            error: 'Conflicto de datos',
            message: 'Ya existe un registro con ese valor',
        });
    }

    // Manejo de errores personalizados con statusCode (los createError)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    // Manejo genérico para cualquier otro error
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message, // O un mensaje genérico si no quieres exponer detalles
    });
};

export default errorHandler;