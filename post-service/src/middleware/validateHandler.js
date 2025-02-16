const { BadRequestError } = require("../core/error.response");
const logger = require("../utils/logger");

const validateHandler = (schema) => {
  return (req, res, next) => {
    const { error } = schema(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);

      throw new BadRequestError(error.details[0].message)

    }
    next();
  };
};

module.exports = validateHandler;
