// db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'maxi_salones',
  password: 'Tudw_2025!',   
  database: 'salonesBD'
});

export { pool };   
