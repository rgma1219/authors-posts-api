const fs = require("fs");
const path = require("path");
const { loadEnvFile } = require("node:process");

try {
    loadEnvFile();
} catch (error) {
    // sin .env local, seguimos (variables ya presentes en el entorno)
}

const pool = require("../src/db/pool");

async function run() {
    const setupSql = fs.readFileSync(path.join(__dirname, "setup.sql"), "utf8");
    const seedSql = fs.readFileSync(path.join(__dirname, "seed.sql"), "utf8");

    console.log("Ejecutando setup.sql...");
    await pool.query(setupSql);

    console.log("Ejecutando seed.sql...");
    await pool.query(seedSql);

    console.log("Base de datos inicializada correctamente.");
    await pool.end();
}

run().catch((err) => {
    console.error("Error al inicializar la base de datos:", err);
    process.exit(1);
});
