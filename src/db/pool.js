const { Pool } = require("pg");

// El driver 'pg' lee automáticamente las variables de entorno
// PGUSER, PGPASSWORD, PGHOST, PGPORT y PGDATABASE.
// No es necesario pasarle un objeto de configuración explícito.
// En producción (Railway), la conexión requiere SSL con certificados
// auto-firmados, por eso 'rejectUnauthorized: false'. En desarrollo local,
// Postgres no usa SSL, así que lo dejamos deshabilitado.
const pool = new Pool({
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
});

module.exports = pool;
