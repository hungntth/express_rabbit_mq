const { SuccessResponse } = require("../core/success.response");
const searchService = require("../services/search.service");

class SearchController {
  searchPost = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await searchService.searchPost({
        query: req.query.query,
      }),
    }).send(res);
  };
}

module.exports = new SearchController();
