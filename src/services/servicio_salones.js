import { getAllSalones } from '../databases/modelo_salones.js';

export async function fetchSalones() {
    return await getAllSalones();
}
