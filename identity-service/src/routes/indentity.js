const express = require("express");
const IdentityController = require("../controllers/identity.controller");
const {
  validateRegistration,
  validateLogin,
  validateRefreshToken,
} = require("../validators/auth.validator");
const validateHandler = require("../middleware/validateHandler");
const asyncHandler = require("../helper/asyncHandler");

const router = express.Router();

router.post(
  "/register",
  validateHandler(validateRegistration),
  asyncHandler(IdentityController.registerUser)
);
router.post(
  "/login",
  validateHandler(validateLogin),
  asyncHandler(IdentityController.loginUser)
);
router.post(
  "/logout",
  validateHandler(validateRefreshToken),
  asyncHandler(IdentityController.logoutUser)
);
router.post(
  "/refresh-token",
  validateHandler(validateRefreshToken),
  asyncHandler(IdentityController.refreshToken)
);

module.exports = router;
