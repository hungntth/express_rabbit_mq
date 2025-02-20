const Search = require("../models/Search");

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
