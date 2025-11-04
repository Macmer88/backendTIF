import jwt from 'jsonwebtoken';
import 'dotenv/config'; 


export async function login(req, res) {

    const usuario = req.user;

    const payload = {
        id: usuario.usuario_id,
        tipo_usuario: usuario.tipo_usuario
    };

    const token = jwt.sign(
        payload,
        process.env.SECRET_KEY_JWT,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        mensaje: 'Login exitoso',
        token: token,
        usuario: {
            id: usuario.usuario_id,
            nombre_usuario: usuario.nombre_usuario,
            tipo_usuario: usuario.tipo_usuario
        }
    });
}