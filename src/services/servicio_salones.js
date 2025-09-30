import { salonesConFiltro, updateSalon } from '../databases/modelo_salones.js';
import { salonesPorId } from '../databases/modelo_salones.js';


export async function fetchSalones(activo,ordenar,desc,limit,offset) {
    return await salonesConFiltro(activo,ordenar,desc,limit,offset);
}

export async function fetchSalonById(id){
    const salon = await salonesPorId(id);
    if(!salon){
        throw new Error('Salón no encontrado');
    }
    if (salon.activo !==1){
        return{
            mensaje: 'Salón inactivo',
            salon_id: salon.salon_id,
            titulo: salon.titulo,
            estado: 'inactivo'
        };
    }
    return {mensaje: 'Salón activo', salon};
}

/*export async function modificarSalon(id, datos) {
    await updateSalon(id, datos);
}*/

export async function modificarSalon(id, datos) {
    const { titulo, direccion, capacidad, activo, importe } = datos;

    if (
        titulo === undefined ||
        direccion === undefined ||
        capacidad === undefined ||
        activo === undefined ||
        importe === undefined
    ) {
        throw new Error("Faltan campos obligatorios");
    }

    const activoInt = Number(activo);
    await updateSalon(id, { titulo, direccion, capacidad, activo: activoInt, importe });
}

