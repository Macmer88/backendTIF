import { pool } from '../config/db.js';

export async function getAllSalones() {
    const [rows] = await pool.query('SELECT * FROM salones');
    return rows;
}
