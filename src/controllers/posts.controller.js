const asyncHandler = require("../utils/asyncHandler");
const postsService = require("../services/posts.service");
const {
    validatePostInput,
    validatePostUpdateInput,
} = require("../utils/validators");

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await postsService.getAll();
    res.json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await postsService.getById(id);
    res.json(post);
});

const getPostsByAuthorId = asyncHandler(async (req, res) => {
    const { authorId } = req.params;
    const posts = await postsService.getByAuthorId(authorId);
    res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
    const { author_id, title, content, published } = req.body;

    validatePostInput({ author_id, title, content });

    const newPost = await postsService.create({
        author_id,
        title,
        content,
        published,
    });
    res.status(201).json({
        status: "success",
        message: "Post creado correctamente",
        id: newPost.id,
    });
});

const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, published } = req.body;

    validatePostUpdateInput({ title, content });

    const updatedPost = await postsService.update(id, {
        title,
        content,
        published,
    });
    res.json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await postsService.remove(id);
    res.status(204).send();
});

module.exports = {
    getAllPosts,
    getPostById,
    getPostsByAuthorId,
    createPost,
    updatePost,
    deletePost,
};
