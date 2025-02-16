const Post = require("../models/Post");

const createPost = async ({ content, mediaIds = [], userId }) => {
  const newlyCreatedPost = new Post({
    user: userId,
    content,
    mediaIds,
  });

  await newlyCreatedPost.save();
  return {};
};

module.exports = {
  createPost,
};
