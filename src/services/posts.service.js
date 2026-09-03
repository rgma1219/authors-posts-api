const pool = require("../db/pool");
const AppError = require("../utils/AppError");
const authorsService = require("./authors.service");

const getAll = async () => {
    const result = await pool.query("SELECT * FROM posts ORDER BY id ASC");
    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);

    if (result.rows.length === 0) {
        throw new AppError("Post no encontrado", 404);
    }
    return result.rows[0];
};

const getByAuthorId = async (authorId) => {
    await authorsService.getById(authorId);
    const result = await pool.query(
        "SELECT * FROM posts WHERE author_id = $1",
        [authorId],
    );
    return result.rows;
};

module.exports = { getAll, getById, getByAuthorId };
