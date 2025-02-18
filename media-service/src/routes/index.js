const express = require("express");
const router = express.Router();

router.use("/api/medias", require("./media"));

module.exports = router;
