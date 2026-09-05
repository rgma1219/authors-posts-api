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

const getByAuthorId = async (author_id) => {
    await authorsService.getById(author_id);
    const result = await pool.query(
        "SELECT * FROM posts WHERE author_id = $1",
        [author_id],
    );
    return result.rows;
};

const create = async ({ author_id, title, content, published }) => {
    await authorsService.getById(author_id);
    const result = await pool.query(
        "INSERT INTO posts (author_id, title, content, published) VALUES ($1, $2, $3, $4) RETURNING *",
        [author_id, title, content, published || false],
    );
    return result.rows[0];
};

const update = async (id, { title, content, published }) => {
    const result = await pool.query(
        "UPDATE posts SET title = $1, content = $2, published = $3 WHERE id = $4 RETURNING *",
        [title, content, published || false, id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Post no encontrado", 404);
    }

    return result.rows[0];
};

const remove = async (id) => {
    const result = await pool.query(
        "DELETE FROM posts WHERE id = $1 RETURNING *",
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Post no encontrado", 404);
    }

    return result.rows[0];
};

module.exports = { getAll, getById, getByAuthorId, create, update, remove };
