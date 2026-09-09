const pool = require("../db/pool");
const AppError = require("../utils/AppError");

const getAll = async () => {
    const result = await pool.query("SELECT * FROM authors ORDER BY id ASC");
    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query("SELECT * FROM authors WHERE id = $1", [
        id,
    ]);

    if (result.rows.length === 0) {
        throw new AppError("Author no encontrado", 404);
    }

    return result.rows[0];
};

const create = async ({ name, email, bio }) => {
    try {
        const result = await pool.query(
            "INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING id",
            [name, email, bio || null],
        );
        return result.rows[0];
    } catch (error) {
        // Código '23505' = unique_violation en PostgreSQL
        if (error.code === "23505") {
            throw new AppError("El email ya está en uso", 409);
        }
        throw error; // cualquier otro error de DB se propaga tal cual, lo maneja el errorHandler
    }
};

const update = async (id, { name, email, bio }) => {
    try {
        const result = await pool.query(
            "UPDATE authors SET name = $1, email = $2, bio = $3 WHERE id = $4 RETURNING *",
            [name, email, bio || null, id],
        );

        if (result.rows.length === 0) {
            throw new AppError("Author no encontrado", 404);
        }

        return result.rows[0];
    } catch (error) {
        if (error.code === "23505") {
            throw new AppError("El email ya está en uso", 409);
        }
        throw error;
    }
};

const remove = async (id) => {
    const result = await pool.query(
        "DELETE FROM authors WHERE id = $1 RETURNING *",
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Author no encontrado", 404);
    }

    return result.rows[0];
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};
