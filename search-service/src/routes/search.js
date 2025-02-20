const express = require("express");
const { authenticateRequest } = require("../middleware/authMiddleware");
const SearchController = require("./../controllers/search.controller");
const asyncHandler = require("../helper/asyncHandler");
const router = express.Router();

router.use(authenticateRequest);

router.get("/post", asyncHandler(SearchController.searchPost));
module.exports = router;
