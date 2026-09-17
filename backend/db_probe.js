const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sms_db',
  });

  try {
    const [schools] = await connection.query('SELECT * FROM tbl_schools');
    console.log('\n--- tbl_schools ---');
    console.log(schools);

    const [admins] = await connection.query('SELECT * FROM tbl_school_admin');
    console.log('\n--- tbl_school_admin ---');
    console.log(admins);

    const [spAdmins] = await connection.query('CALL sp_get_school_admins()');
    console.log('\n--- CALL sp_get_school_admins() ---');
    console.log(spAdmins[0]);
  } catch (err) {
    console.error('Error querying:', err);
  } finally {
    await connection.end();
  }
}

main();
