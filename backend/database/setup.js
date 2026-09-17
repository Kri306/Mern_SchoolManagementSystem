const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  console.log('Connecting to MySQL using environment variables...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  console.log('Connected to MySQL server successfully.');

  console.log('Recreating database for a clean schema setup...');
  await connection.query('DROP DATABASE IF EXISTS sms_db');
  await connection.query('CREATE DATABASE sms_db');
  await connection.query('USE sms_db');
  console.log('Clean database sms_db created.');

  const sqlFilePath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(sqlFilePath)) {
    throw new Error(`schema.sql not found at ${sqlFilePath}`);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

  // Parse SQL statements by tracking the current delimiter
  const lines = sqlContent.split(/\r?\n/);
  let currentDelimiter = ';';
  let currentStatement = '';
  const statements = [];

  for (let line of lines) {
    const trimmedLine = line.trim();
    
    // Skip comment lines
    if (trimmedLine.startsWith('--') || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Skip empty lines if we aren't inside a statement
    if (!trimmedLine && !currentStatement) {
      continue;
    }

    // Check for delimiter changes (e.g., DELIMITER // or DELIMITER ;)
    if (trimmedLine.toLowerCase().startsWith('delimiter')) {
      const parts = trimmedLine.split(/\s+/);
      if (parts[1]) {
        currentDelimiter = parts[1];
      }
      continue;
    }

    currentStatement += line + '\n';

    // Check if the statement ends with the current delimiter
    if (trimmedLine.endsWith(currentDelimiter)) {
      let stmt = currentStatement.trim();
      if (stmt.endsWith(currentDelimiter)) {
        stmt = stmt.slice(0, -currentDelimiter.length).trim();
      }
      if (stmt) {
        statements.push(stmt);
      }
      currentStatement = '';
    }
  }

  console.log(`Parsed ${statements.length} SQL statements. Executing them sequentially...`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await connection.query(stmt);
    } catch (err) {
      console.error(`\n[ERROR] Failed to execute statement #${i + 1}:`);
      console.error('--- Statement ---');
      console.error(stmt);
      console.error('-----------------');
      console.error(`Message: ${err.message}`);
      throw err;
    }
  }

  console.log('\n[SUCCESS] Database tables, seed data, and stored procedures setup completed successfully!');
  await connection.end();
}

run().catch(err => {
  console.error('\n[FAILED] Setup encountered an error:', err.message);
  process.exit(1);
});
