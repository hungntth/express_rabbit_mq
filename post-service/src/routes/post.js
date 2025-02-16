const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");
const PostController = require("./../controller/post.controller");
const asyncHandler = require("../../../identity-service/src/helper/asyncHandler");
const router = express.Router();

router.use(authenticateRequest);
router.post("/create-post", asyncHandler(PostController.createPost));

module.exports = router;
