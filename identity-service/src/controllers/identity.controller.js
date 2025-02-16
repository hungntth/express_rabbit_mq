const { SuccessResponse } = require("../core/success.response");
const identityService = require("../services/identity.service");

class IdentityController {
  registerUser = async (req, res) => {
    new SuccessResponse({
      message: "User registered successfully!",
      metadata: await identityService.registerUser(req.body),
    }).send(res);
  };

  loginUser = async (req, res) => {
    new SuccessResponse({
      message: "User login successfully!",
      metadata: await identityService.loginUser(req.body),
    }).send(res);
  };

  refreshToken = async (req, res) => {
    new SuccessResponse({
      message: "User refresh successfully!",
      metadata: await identityService.refreshToken(req.body),
    }).send(res);
  };

  logoutUser = async (req, res) => {
    new SuccessResponse({
      message: "User logout successfully!",
      metadata: await identityService.logoutUser(req.body),
    }).send(res);
  };
}

module.exports = new IdentityController();
