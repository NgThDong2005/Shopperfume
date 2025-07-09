import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'yamabiko.proxy.rlwy.net',
  port: 42739,
  user: 'root',
  password: 'fdTsJCrdZPkFcJJIQgneLJGwSTmhkRtP',
  database: 'perfume_shop'
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
