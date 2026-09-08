const { Pool } = require("pg");

const isLocalHost = ["localhost", "127.0.0.1"].includes(process.env.PGHOST);

const pool = new Pool({
    ssl: isLocalHost ? false : { rejectUnauthorized: false },
});

module.exports = pool;
