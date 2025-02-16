const { AuthFailureError, TooManyRequests } = require("../core/error.response");
const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    throw new AuthFailureError(
      "Authencation required! Please login to continue"
    );

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) throw new TooManyRequests("Invalid token!");

    req.user = user;
    next();
  });
};

module.exports = { validateToken };
