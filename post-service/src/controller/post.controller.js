const { SuccessResponse } = require("../core/success.response");
const postService = require("../services/post.service");

class PostController {
  createPost = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await postService.createPost({
        ...req.body,
        ...req.user,
        redisClient: req.redisClient,
      }),
    }).send(res);
  };

  getAllPosts = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await postService.getAllPosts({
        ...req.params,
        redisClient: req.redisClient,
      }),
    }).send(res);
  };

  getPosts = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await postService.getPosts({
        postId: req.params.id,
        redisClient: req.redisClient,
      }),
    }).send(res);
  };

  deletePost = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await postService.deletePost({
        postId: req.params.id,
        redisClient: req.redisClient,
        ...req.user,
      }),
    }).send(res);
  };
}

module.exports = new PostController();
