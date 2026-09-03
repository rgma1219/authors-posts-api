const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts.controller");

router.get("/", postsController.getAllPosts);
router.get("/author/:authorId", postsController.getPostsByAuthorId);
router.get("/:id", postsController.getPostById);

module.exports = router;
