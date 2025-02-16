const express = require("express");
const router = express.Router();

router.use("/api/posts", require("./post"));

module.exports = router;
