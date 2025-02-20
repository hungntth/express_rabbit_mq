const express = require("express");
const router = express.Router();

router.use("/api/search", require("./search"));

module.exports = router;
