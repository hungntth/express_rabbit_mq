const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");
const PostController = require("./../controller/post.controller");
const asyncHandler = require("../helper/asyncHandler");
const router = express.Router();

router.use(authenticateRequest);

router.post("/create-post", asyncHandler(PostController.createPost));
router.get("/all-post", asyncHandler(PostController.getAllPosts));
router.get("/:id", asyncHandler(PostController.getPosts));
router.delete("/:id", asyncHandler(PostController.deletePost));

module.exports = router;
