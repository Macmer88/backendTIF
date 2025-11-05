import winston from 'winston';
import path from 'path';

const logDir = path.resolve(process.cwd(), 'logs');

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
                return `${info.timestamp} ${info.level}: [${info.usuario}] ${info.method} ${info.url}`;
            }

            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    )
});


const logger = winston.createLogger({
    transports: [auditTransport, consoleTransport]
});

export const errorLogger = winston.createLogger({
    transports: [errorTransport, consoleTransport]
});

const loggerMiddleware = (req, res, next) => {
    const usuario = req.user ? `${req.user.usuario_id} (${req.user.nombre_usuario})` : 'Invitado';

    logger.info({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        usuario: usuario,
        ip: req.ip
    });

    next();
};

export default loggerMiddleware;