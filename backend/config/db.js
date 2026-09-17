const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sms_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Execute a stored procedure with parameters
 * @param {string} spName - Name of the stored procedure (e.g., 'sp_get_schools')
 * @param {Array} params - Array of parameters to pass to the SP
 * @returns {Promise<Array>} - Result rows from the SP
 */
async function callSP(spName, params = []) {
  const placeholders = params.map(() => '?').join(',');
  const sql = `CALL ${spName}(${placeholders})`;
  
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(sql, params);
    // Stored procedures return an array of arrays, where the first element is the actual row results
    return results[0] || [];
  } catch (error) {
    console.error(`Error executing SP ${spName}:`, error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  pool,
  callSP
};
