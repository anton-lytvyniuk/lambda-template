const { INTERNAL_SERVER_ERROR, getStatusText } = require('http-status-codes');

/**
 * Next is mandatory here because express treat it as an error handler.
 *
 * It will be skipped if we remove it. next
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const {
    statusCode = INTERNAL_SERVER_ERROR,
    message,
    localisationCode,
    validationErrors,
  } = err;

  const response = {
    http_status: statusCode,
    message: message || getStatusText(statusCode),
    localisation_code: localisationCode ? String(localisationCode) : undefined,
    validation_errors: validationErrors,
    correlation_id: req.app.logger.getConfig().defaultLog.correlation_id,
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
