const logger = require("../utils/logger");

const notFoundHandler = (req, res, next) => {
  logger.warn("Not Found");

  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};

module.exports = notFoundHandler;
