const { loadEnvFile } = require("node:process");

try {
    loadEnvFile();
} catch (error) {
    // No hay archivo .env local (por ejemplo, en Railway las variables de entorno se inyectan directamente al proceso, sin necesidad de un archivo físico)
}

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
