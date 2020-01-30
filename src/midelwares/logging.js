const safeStringify = require('fast-safe-stringify');
const { v4: randomUuid } = require('uuid');

const logger = require('../utils/logger');
const obfuscate = require('../utils/obfuscator');

const CORRELATION_ID_HEADER_NAME = 'correlation-id';
const HEADERS_TO_OBFUSCATE = ['authorization'];

module.exports = (params) => {
  const {
    handleFinishRequest,
    loggingRequest,
    obfuscate: {
      headers: headersToObfuscate,
      body: bodyToObfuscate,
      query: queryToObfuscate,
    } = {},
  } = params || {};

  return (req, res, next) => {
    const {
      originalUrl,
      method,
      headers,
      body,
      query,
      apiGateway: {
        event: {
          requestContext: {
            requestId,
          } = {},
        } = {},
        context: {
          awsRequestId,
        } = {},
      } = {},
    } = req;
    const id = randomUuid();
    const correlationId = req.get(CORRELATION_ID_HEADER_NAME) || randomUuid();

    res.append(CORRELATION_ID_HEADER_NAME, correlationId);

    req.app.logger = (...args) => {
      const obj = {
        awsRequestId,
        correlation_id: correlationId,
        id,
        method,
        originalUrl,
        path_with_params:
      requestId,
      };

      args.forEach((arg, ind) => { obj[`log${ind || ''}`] = arg; });
      logger.info(safeStringify(obj));
    };

    if (handleFinishRequest) {
      res.on('finish', () => handleFinishRequest(req));
    }

    if (loggingRequest) {
      logger.info(safeStringify({
        body: body ? safeStringify(obfuscate(body, bodyToObfuscate)) : null,
        headers: safeStringify(obfuscate(headers, headersToObfuscate || HEADERS_TO_OBFUSCATE)),
        query: query ? safeStringify(obfuscate(query, queryToObfuscate)) : null,
      }));
    }
    next();
  };
};
