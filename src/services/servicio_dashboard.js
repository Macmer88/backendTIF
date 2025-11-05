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

/*
* (Aquí añadiremos más funciones a medida que creemos más Stored Procedures,
* como obtenerSalonesPopulares, etc.)
*/