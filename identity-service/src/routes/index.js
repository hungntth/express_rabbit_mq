const express = require("express");
const router = express.Router();

router.use("/api/auth", require("./indentity"));

module.exports = router;
