const { Pool } = require("pg");

// El driver 'pg' lee automáticamente las variables de entorno
// PGUSER, PGPASSWORD, PGHOST, PGPORT y PGDATABASE.
// No es necesario pasarle un objeto de configuración explícito.
const pool = new Pool();

module.exports = pool;
