const asyncHandler = require("../utils/asyncHandler");
const postsService = require("../services/posts.service");

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

module.exports = {
    getAllPosts,
    getPostById,
    getPostsByAuthorId,
};
