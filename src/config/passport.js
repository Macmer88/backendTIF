import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { usuariosPorId, buscarPorNombreUsuario } from '../databases/modelo_usuarios.js';

// --- ESTRATEGIA JWT (Para proteger rutas) ---

// Esta es la configuración de la estrategia JWT
const jwtOptions = {
    // Le decimos a Passport que busque el token en el 'Authorization' header
    // con el formato "Bearer <token>"
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

    // Esta debe ser la misma clave secreta que usas para FIRMAR el token
    secretOrKey: process.env.SECRET_KEY_JWT
};

/**
 * Esta función se ejecuta CADA VEZ que una ruta protegida es llamada.
 * 'jwt_payload' es el objeto que guardaste en el token (ej: { id: 1, tipo_usuario: 'ADMIN' })
 */
const jwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        // Buscamos al usuario en la BD usando el ID del token
        const usuario = await usuariosPorId(jwt_payload.id);

        if (usuario) {
            // Si encontramos al usuario, lo "adjuntamos" al request (req.user)
            return done(null, usuario);
        } else {
            // Si el usuario no existe (ej: fue eliminado)
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});


// --- ESTRATEGIA LOCAL (Para el Login) ---

/**
 * Esta función se ejecuta SÓLO en la ruta de LOGIN (POST /auth/login)
 */
const localStrategy = new LocalStrategy({
    // Le decimos a Passport qué campos del req.body usar
    usernameField: 'nombre_usuario',
    passwordField: 'contrasenia'
}, async (nombre_usuario, contrasenia, done) => {
    try {
        // 1. Buscamos al usuario por su nombre_usuario
        const usuario = await buscarPorNombreUsuario(nombre_usuario);

        // 2. Si no encontramos al usuario
        if (!usuario) {
            return done(null, false, { message: 'Usuario no encontrado.' });
        }

        // 3. Comparamos la contraseña del body con la de la BD
        const esMatch = await bcrypt.compare(contrasenia, usuario.contrasenia);

        // 4. Si la contraseña NO coincide
        if (!esMatch) {
            return done(null, false, { message: 'Contraseña incorrecta.' });
        }

        // 5. ¡Éxito! El usuario es válido
        return done(null, usuario);

    } catch (error) {
        return done(error);
    }
});


// --- Exportación final ---
// Le entregamos ambas estrategias a Passport
export default (passport) => {
    passport.use(jwtStrategy);    // La de JWT (para proteger)
    passport.use(localStrategy); // La de Local (para login)
};