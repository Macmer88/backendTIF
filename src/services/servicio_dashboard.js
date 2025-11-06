import { pool } from '../config/db.js';
import createError from 'http-errors';


export async function obtenerEstadisticasFacturacion() {
    try {
        const [rows] = await pool.query('CALL SP_Reporte_Facturacion_Por_Mes()');
        return rows[0]; 

    } catch (error) {
        console.error("Error al ejecutar SP_Reporte_Facturacion_Por_Mes:", error.message);
        throw createError(500, 'Error al obtener las estadísticas de facturación.');
    }
}



export async function obtenerSalonesPopulares() {
    try {
        const [rows] = await pool.query('CALL SP_Reporte_Salones_Populares()');

        return rows[0]; 

    } catch (error) {
        console.error("Error al ejecutar SP_Reporte_Salones_Populares:", error.message);
        throw createError(500, 'Error al obtener estadísticas de salones.');
    }
}


export async function obtenerServiciosPopulares() {
    try {
        const [rows] = await pool.query('CALL SP_Reporte_Servicios_Populares()');

        return rows[0]; 

    } catch (error) {
        console.error("Error al ejecutar SP_Reporte_Servicios_Populares:", error.message);
        throw createError(500, 'Error al obtener estadísticas de servicios.');
    }
}

export async function obtenerTurnosPopulares() {
    try {
        const [rows] = await pool.query('CALL SP_Reporte_Turnos_Populares()');
        
        return rows[0]; 

    } catch (error) {
        console.error("Error al ejecutar SP_Reporte_Turnos_Populares:", error.message);
        throw createError(500, 'Error al obtener estadísticas de turnos.');
    }
}

export async function obtenerDiasPopulares(anio, mes) {
    try {
        const [rows] = await pool.query('CALL SP_Reporte_Dias_Populares_Por_Mes(?, ?)', [anio, mes]);
        
        return rows[0]; 

    } catch (error) {
        console.error("Error al ejecutar SP_Reporte_Dias_Populares_Por_Mes:", error.message);
        throw createError(500, 'Error al obtener estadísticas de días populares.');
    }
}