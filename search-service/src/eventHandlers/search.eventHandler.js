const Search = require("../models/Search");

async function handlerPostCreated(event) {
  const newSearchPosts = new Search({
    postId: event.postId,
    userId: event.userId,
    content: event.content,
    createdAt: event.createdAt,
  });

  await newSearchPosts.save();
}

async function handlePostDeleted(event) {
  await Search.findOneAndDelete({ postId: event.postId });
}

module.exports = { handlerPostCreated, handlePostDeleted };
