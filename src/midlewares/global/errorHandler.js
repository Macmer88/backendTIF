
// Este middleware captura cualquier error que ocurra en rutas o middlewares
const errorHandler = (err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const path = req.originalUrl;
    const method = req.method;

    // Log básico con contexto de la petición
    console.error(`[${timestamp}] ${method} ${path}`);
    console.error(`Error: ${err.name} - ${err.message}`);

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

    // Manejo de errores personalizados con statusCode
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    // Manejo genérico para cualquier otro error
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message,
    });
};

export default errorHandler;
