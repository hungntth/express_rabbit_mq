const { BadRequestError } = require("../core/error.response");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const generateTokens = require("../utils/generateToken");

const registerUser = async ({ email, password, username }) => {
  let user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (user) throw new BadRequestError("User already exists");

  user = new User({ email, password, username });
  await user.save();

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, password }) => {
  let user = await User.findOne({
    email,
  });

  if (!user) throw new BadRequestError("Invalid user");

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) throw new BadRequestError("Invalid user");

  const { accessToken, refreshToken } = await generateTokens(user);

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async ({ refreshToken }) => {
  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken || storedToken.expiresAt < new Date())
    throw new BadRequestError("Invalid or expired refresh token");

  const user = await User.findById(storedToken.user);

  if (!user) new BadRequestError("Invalid or expired refresh token");

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateTokens(user);
  await RefreshToken.deleteOne({ _id: storedToken._id });

  return {
    newAccessToken,
    newRefreshToken,
  };
};

const logoutUser = async ({ refreshToken }) => {
  await RefreshToken.deleteOne({ token: refreshToken });
  return {};
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser };
