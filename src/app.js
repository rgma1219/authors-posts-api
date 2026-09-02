const express = require("express");
const pool = require("./db/pool");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const authorsRoutes = require("./routes/authors.routes");

const app = express();

// Middleware nativo de Express para parsear JSON en el body de los requests
app.use(express.json());

// Middleware de logging nativo
app.use(requestLogger);

// Endpoint de salud: confirma que el servidor responde Y que la conexión a la DB funciona
app.get("/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            status: "ok",
            db_time: result.rows[0].now,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "No se pudo conectar a la base de datos",
        });
    }
});

// (Acá van las rutas de /authors y /posts
app.use("/authors", authorsRoutes);

// Middleware para rutas no encontradas (404) - va DESPUÉS de todas las rutas
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
});

// Middleware de manejo de errores - SIEMPRE al final, después de todo lo demás
app.use(errorHandler);

module.exports = app;
