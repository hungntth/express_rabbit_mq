const express = require("express");
const {
  registerUser,
  loginUser,
  log,
  logoutUser,
  refreshToken,
} = require("../controllers/identity-controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

module.exports = router;
