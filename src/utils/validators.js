const AppError = require("./AppError");

// Regex simple para formato de email (suficiente para este proyecto, sin sobre-ingeniería)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateAuthorInput = ({ name, email }) => {
    if (!name || typeof name !== "string" || name.trim() === "") {
        throw new AppError('El campo "name" es obligatorio', 400);
    }

    if (!email || typeof email !== "string" || email.trim() === "") {
        throw new AppError('El campo "email" es obligatorio', 400);
    }

    if (!EMAIL_REGEX.test(email)) {
        throw new AppError('El campo "email" no tiene un formato válido', 400);
    }
};

module.exports = {
    validateAuthorInput,
};
