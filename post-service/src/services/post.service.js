const { BadRequestError } = require("../core/error.response");
const Post = require("../models/Post");
const { publishEvent } = require("../utils/rabbitmq");

async function invalidatePostsCache({ redisClient, input }) {
  const cachedKey = `post:${input}`;
  await redisClient.del(cachedKey);

  const keys = await redisClient.keys("posts:*");
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
}

const createPost = async ({ content, mediaIds = [], userId, redisClient }) => {
  const newlyCreatedPost = new Post({
    user: userId,
    content,
    mediaIds,
  });

  await newlyCreatedPost.save();

  await publishEvent("post.created", {
    postId: newlyCreatedPost._id.toString(),
    userId: newlyCreatedPost.user.toString(),
    content: newlyCreatedPost.content,
    createdAt: newlyCreatedPost.createdAt,
  });

  await invalidatePostsCache({
    redisClient,
    input: newlyCreatedPost._id.toString(),
  });
  return;
};

const getAllPosts = async ({ page = 1, limit = 10, redisClient }) => {
  const startIndex = (page - 1) * limit;

  const cacheKey = `posts:${page}:${limit}`;
  const cachedPosts = await redisClient.get(cacheKey);

  if (cachedPosts) {
    return JSON.parse(cachedPosts);
  }

  const posts = await Post.find({})
    .sort({ createAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const totalNoOfPosts = await Post.countDocuments();

  const result = {
    posts,
    currentpage: page,
    totalPages: Math.ceil(totalNoOfPosts / limit),
    totalPosts: totalNoOfPosts,
  };

  await redisClient.setex(cacheKey, 300, JSON.stringify(result));
  return result;
};

const getPosts = async ({ postId, redisClient }) => {
  const cacheKey = `post:${postId}`;

  const cachedPost = await redisClient.get(cacheKey);

  if (cachedPost) {
    return JSON.parse(cachedPost);
  }

  const postDetailById = await Post.findById(postId);
  if (!postDetailById) throw new BadRequestError("Invalid get post");

  await redisClient.setex(cacheKey, 3000, JSON.stringify(postDetailById));
  return postDetailById;
};

const deletePost = async ({ postId, userId, redisClient }) => {
  const post = await Post.findOneAndDelete({
    _id: postId,
    user: userId,
  });

  if (!post) throw new BadRequestError("Invalid delete post");

  await publishEvent("post.deleted", {
    postId,
    userId,
    mediasIds: post.mediaIds,
  });

  await invalidatePostsCache({
    redisClient,
    input: postId,
  });

  return;
};

module.exports = {
  createPost,
  getAllPosts,
  getPosts,
  deletePost,
};
