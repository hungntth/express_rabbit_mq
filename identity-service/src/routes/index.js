const express = require("express");
const router = express.Router();

router.use("/api/auth", require("./indentity-service"));

module.exports = router;
