const Search = require("../models/search");

const searchPost = async ({ query }) => {
  const results = await Search.find(
    {
      $text: { $search: query },
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(10);

  return results;
};

module.exports = {
  searchPost,
};
