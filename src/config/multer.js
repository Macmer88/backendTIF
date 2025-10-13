import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 

const storage = multer.diskStorage({

    destination: 'src/uploads/cumpleaneros',

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const nombreUnico = uuidv4();
        cb(null, `${nombreUnico}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Verificamos si el archivo es una imagen
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // Si no es una imagen, lo rechazamos y lanzamos un error
        const error = new Error('Formato de archivo no válido. Solo se aceptan imágenes.');
        error.statusCode = 400;
        cb(error, false);
    }
};

const uploadCumpleanero = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Límite de 5 MB por archivo
    }
});

export { uploadCumpleanero };