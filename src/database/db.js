const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'admin',
  database: 'cce3',
  port: '5432'
});

module.exports = {
  pool
}  ;