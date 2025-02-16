const { SuccessResponse } = require("../core/success.response");
const postService = require("../services/post.service");

class PostController {
  createPost = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await postService.createPost({ ...req.body, ...req.user }),
    }).send(res);
  };
}

module.exports = new PostController();
