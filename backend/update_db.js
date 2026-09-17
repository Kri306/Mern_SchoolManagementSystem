const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('Connecting to database...');
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sms_db'
  });

  const targetPasswordHash = '$2a$10$F9nAJWv35oSivcuQxUEWcu5HJVj0l2t747mmlamEw22EGGdd2JXo6'; // 'admin123'
  console.log('Updating tbl_users...');
  const [res1] = await conn.query(
    'UPDATE tbl_users SET password = ? WHERE email = ?',
    [targetPasswordHash, 'jeevanbharti@admin.com']
  );
  console.log('tbl_users update rows affected:', res1.affectedRows);

  console.log('Updating tbl_school_admin...');
  const [res2] = await conn.query(
    'UPDATE tbl_school_admin SET password = ? WHERE email = ?',
    [targetPasswordHash, 'jeevanbharti@admin.com']
  );
  console.log('tbl_school_admin update rows affected:', res2.affectedRows);

  await conn.end();
  console.log('Password updated successfully!');
}

main().catch(console.error);
