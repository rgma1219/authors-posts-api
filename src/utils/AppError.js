class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // marca que es un error "esperado" de negocio, no un bug
    }
}

module.exports = AppError;
