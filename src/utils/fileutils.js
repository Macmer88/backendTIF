import { unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// configuración para obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const deleteImage = async (fileName) => {
    // Si no nos pasan un nombre de archivo, no hacemos nada.
    if (!fileName) return;

    try {
        // Construimos la ruta completa al archivo que queremos borrar.

        const filePath = path.join(__dirname, '../public/uploads/cumpleaneros', fileName);

        // Intentamos borrar el archivo.
        await unlink(filePath);
        console.log(`Archivo eliminado con éxito: ${fileName}`);
    } catch (error) {
        // Si el archivo no existe (código 'ENOENT'), no es un error crítico,
        // simplemente lo informamos en la consola y seguimos.
        if (error.code === 'ENOENT') {
            console.log(`El archivo ${fileName} no fue encontrado, no se pudo eliminar.`);
        } else {
            // Para cualquier otro error, lo mostramos en la consola.
            console.error(`Error al intentar eliminar el archivo ${fileName}:`, error);
        }
    }
};