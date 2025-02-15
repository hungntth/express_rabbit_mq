const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const logger = require("../utils/logger");
const {
  validateRegistration,
  validateRefreshToken,
  validateLogin,
} = require("../utils/validation");

const registerUser = async (req, res) => {
  logger.info("Registration endpoint hit...");
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);

      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password, username } = req.body;

    let user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (user) {
      logger.warn("User already exists");

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ email, password, username });
    await user.save();
    logger.warn("User saved successfully", user._id);

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      accessToken,
      refreshToken,
    });
  } catch (e) {
    logger.error("Registration error");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  logger.info("Login endpoint hit...");

  try {
    const { error } = validateLogin(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);

      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    let user = await User.findOne({
      email,
    });

    if (!user) {
      logger.warn("Invalid user");

      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      logger.warn("Invalid user");

      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
      success: true,
      message: "User login successfully!",
      accessToken,
      refreshToken,
    });
  } catch (e) {
    logger.error("Login error");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshToken = async (req, res) => {
  logger.info("refreshToken endpoint hit...");
  try {
    // const { error } = validateRefreshToken(req.body);
    // if (error) {
    //   logger.warn("Validation error", error.details[0].message);

    //   return res.status(400).json({
    //     success: false,
    //     message: error.details[0].message,
    //   });
    // }

    const { refreshToken } = req.body;

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      logger.warn("Invalid or expired refresh token");

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(storedToken.user);

    if (!user) return;

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);
    await RefreshToken.deleteOne({ _id: storedToken._id });

    res.status(200).json({
      success: true,
      message: "User refresh token successfully!",
      newAccessToken,
      newRefreshToken,
    });
  } catch (error) {
    logger.error("refreshToken error");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  logger.info("logoutUser endpoint hit...");
  try {
    // const { error } = validateRefreshToken(req.body);
    // if (error) {
    //   logger.warn("Validation error", error.details[0].message);

    //   return res.status(400).json({
    //     success: false,
    //     message: error.details[0].message,
    //   });
    // }

    const { refreshToken } = req.body;

    await RefreshToken.deleteOne({ token: refreshToken });
    res.status(200).json({
      success: true,
      message: "User logout successfully!",
    });
  } catch (error) {
    logger.error("logoutUser error");
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser };
