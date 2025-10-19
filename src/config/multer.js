import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import fs from 'fs';

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        const error = new Error('Formato de archivo no válido. Solo se aceptan imágenes.');
        error.statusCode = 400;
        cb(error, false);
    }
};

// --- FUNCIÓN AUXILIAR PARA CREAR CARPETAS ---
const crearCarpetaSiNoExiste = (directorio) => {
    if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio, { recursive: true });
        console.log(`Directorio creado: ${directorio}`);
    }
};

// --- 1. CONFIGURACIÓN PARA CUMPLEAÑEROS (RESERVAS) ---
const dirCumpleaneros = 'src/public/uploads/cumpleaneros';
crearCarpetaSiNoExiste(dirCumpleaneros);

const storageCumpleanero = multer.diskStorage({
    destination: dirCumpleaneros,
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombreUnico = uuidv4();
        cb(null, `${nombreUnico}${extension}`);
    }
});

export const uploadCumpleanero = multer({ 
    storage: storageCumpleanero,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB
});

// --- 2. CONFIGURACIÓN PARA USUARIOS ---
const dirUsuarios = 'src/public/uploads/usuarios';
crearCarpetaSiNoExiste(dirUsuarios);

const storageUsuario = multer.diskStorage({
    destination: dirUsuarios,
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombreUnico = uuidv4();
        cb(null, `${nombreUnico}${extension}`);
    }
});

export const uploadUsuario = multer({ 
    storage: storageUsuario,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB
});