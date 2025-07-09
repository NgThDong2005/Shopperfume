import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("Database config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    return console.error('Connection failed:', err.message);
  }
  console.log('Connected to Railway MySQL!');

  connection.query('SELECT NOW()', (err, results) => {
    if (err) throw err;
    console.log('Current time:', results[0]);
    connection.end();
  });
});


connection.query('SHOW TABLES', (err, results) => {
  if (err) throw err;

  const tableKey = Object.keys(results[0])[0]; 
  const tableNames = results.map(row => row[tableKey]);

  console.log('Tables:', tableNames);

  tableNames.forEach((table) => {
    connection.query(`SELECT * FROM \`${table}\``, (err, rows) => {
      if (err) throw err;
      console.log(`Data in table [${table}]:`, rows);
    });
  });
});
