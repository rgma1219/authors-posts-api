const asyncHandler = require("../utils/asyncHandler");
const authorsService = require("../services/authors.service");
const { validateAuthorInput } = require("../utils/validators");

const getAllAuthors = asyncHandler(async (req, res) => {
    const authors = await authorsService.getAll();
    res.json(authors);
});

const getAuthorById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const author = await authorsService.getById(id);
    res.json(author);
});

const createAuthor = asyncHandler(async (req, res) => {
    const { name, email, bio } = req.body;

    validateAuthorInput({ name, email });

    const newAuthor = await authorsService.create({ name, email, bio });
    res.status(201).json({
        status: "success",
        message: "Author creado correctamente",
        id: newAuthor.id,
    });
});

const updateAuthor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, bio } = req.body;

    validateAuthorInput({ name, email });

    const updatedAuthor = await authorsService.update(id, { name, email, bio });
    res.json(updatedAuthor);
});

const deleteAuthor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await authorsService.remove(id);
    res.status(204).send();
});

module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
};
