const { AuthFailureError } = require("../core/error.response");

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (!userId)
    throw new AuthFailureError(
      "Authencation required! Please login to continue Post"
    );

  req.user = { userId };
  next();
};

module.exports = { authenticateRequest };
