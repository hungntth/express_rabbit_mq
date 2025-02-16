const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.status || 500;
  const resMessage = `${statusCode} - ${
    Date.now
  }ms - Response: ${JSON.stringify(err)}`;

  logger.error(resMessage);

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
