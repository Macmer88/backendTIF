import winston from 'winston';
import path from 'path';

const logDir = path.resolve(process.cwd(), 'logs');

// --- MAPEO DE ROLES ---
const ROL_MAP = {
    1: 'Cliente',
    2: 'Empleado', // Puedes usar 'Operario' si prefieres
    3: 'Admin'
};

const getRoleName = (rolId) => ROL_MAP[rolId] || `Desconocido (${rolId})`;
// -----------------------

const auditTransport = new winston.transports.File({
    filename: path.join(logDir, 'audit.log'), 
    level: 'info', 
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

const errorTransport = new winston.transports.File({
    filename: path.join(logDir, 'errors.log'),
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
});

// Transporte para la consola 
const consoleTransport = new winston.transports.Console({
    level: 'debug', // Muestra todo en la consola
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }), // Añade hora
        winston.format.printf(info => {
            
            if (info.errorMessage) {
                return `${info.timestamp} ${info.level}: ${info.errorMessage} (Path: ${info.path}, Status: ${info.statusCode})`;
            }

            if (info.usuario) {
                // Formato de salida: [HH:mm:ss info]: [16 (maxvil@correo.com) - Rol: Admin] GET /dashboard/turnos
                return `${info.timestamp} ${info.level}: [${info.usuario}] ${info.method} ${info.url}`; 
            }

            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    )
});


const logger = winston.createLogger({
    transports: [auditTransport, consoleTransport]
});

// Exportamos el errorLogger (sin cambios)
export const errorLogger = winston.createLogger({
    transports: [errorTransport, consoleTransport]
});

// La función de auditoría (Middleware)
export const auditLoggerMiddleware = (req, res, next) => {
    // Obtenemos el nombre del rol (ej: Admin, Empleado, Cliente)
    const nombreRol = req.user ? getRoleName(req.user.tipo_usuario) : '';
    
    const usuario = req.user 
        ? `${req.user.usuario_id} (${req.user.nombre_usuario}) - Rol: ${nombreRol}` 
        : 'Invitado';

    logger.info({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        usuario: usuario, 
        ip: req.ip
    });

    next();
};
