import createError from 'http-errors';

export const esRol = (...rolesPermitidos) => {

    return (req, res, next) => {

        if (!req.user || !req.user.tipo_usuario) {
            return next(createError(500, 'Error interno: No se ha definido el rol del usuario.'));
        }

        const rolUsuario = req.user.tipo_usuario;

        if (!rolesPermitidos.includes(rolUsuario)) {
            return next(createError(403, `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}`));
        }

        next();
    }
}

