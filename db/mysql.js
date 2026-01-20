import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',        // XAMPP mặc định
  database: 'shopdb',
});

console.log('✅ MySQL pool created');

export default pool;

