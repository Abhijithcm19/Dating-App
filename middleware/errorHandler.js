const logger = require("../utils/logger.js");

const constants = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode;
  if (!statusCode || statusCode < 400) {
    statusCode = constants.SERVER_ERROR;
  }

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      logger.error("Validation Failed:", err.stack);
      res.status(constants.VALIDATION_ERROR).json({
        title: "Validation Failed",
        message: err.message,
      });
      break;
    case constants.UNAUTHORIZED:
      logger.error("Unauthorized:", err.stack);
      res.status(constants.UNAUTHORIZED).json({
        title: "Unauthorized",
        message: err.message,
      });
      break;
    case constants.FORBIDDEN:
      logger.error("Forbidden:", err.stack);
      res.status(constants.FORBIDDEN).json({
        title: "Forbidden",
        message: err.message,
      });
      break;
    case constants.NOT_FOUND:
      logger.error("Not Found:", err.stack);
      res.status(constants.NOT_FOUND).json({
        title: "Not Found",
        message: err.message,
      });
      break;
    case constants.SERVER_ERROR:
    default:
      logger.error("Server Error:", err.stack);
      res.status(constants.SERVER_ERROR).json({
        title: "Server Error",
        message: err.message,
      });
      break;
  }
};

module.exports = errorHandler;
