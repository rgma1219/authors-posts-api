const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.isOperational
        ? err.message
        : "Error interno del servidor";

    // Log completo en consola para debugging (nunca lo mandamos al cliente)
    console.error(err);

    res.status(statusCode).json({
        status: "error",
        message,
    });
};

module.exports = errorHandler;
