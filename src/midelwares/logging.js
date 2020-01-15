const { v4: randomUuid } = require('uuid');
const safeStringify = require('fast-safe-stringify');

const { deepCopy, getProperty, setProperty } = require('./helper');

const CORRELATION_ID_HEADER_NAME = 'correlation-id';
const OBFUSCATED_STRING = '*******';
const HEADERS_TO_OBFUSCATE = ['authorization'];

const obfuscate = (object, propertiesToObfuscate = []) => {
  if (typeof object !== 'object' || !propertiesToObfuscate.length) {
    return object;
  }
  const obfuscatedObject = deepCopy(object);

  propertiesToObfuscate.forEach((propertyName) => {
    if (getProperty(obfuscatedObject, propertyName) !== undefined) {
      setProperty(obfuscatedObject, propertyName, OBFUSCATED_STRING);
    }
  });
  return obfuscatedObject;
};

const loggingMiddleware = ({
  handleFinishRequest,
  loggingRequest,
  obfuscate: {
    headers: headersToObfuscate,
    body: bodyToObfuscate,
    query: queryToObfuscate,
  } = {},
} = {}) => (req, res, next) => {
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
      correlation_id: correlationId,
      path_with_params:
      originalUrl,
      method,
      id,
      requestId,
      awsRequestId,
    };

    args.forEach((arg, ind) => { obj[`log${ind || ''}`] = arg; });
    console.log(safeStringify(obj));
  };

  if (handleFinishRequest) {
    res.on('finish', () => handleFinishRequest(req));
  }

  if (loggingRequest) {
    console.log(safeStringify({
      headers: safeStringify(obfuscate(headers, headersToObfuscate || HEADERS_TO_OBFUSCATE)),
      query: query ? safeStringify(obfuscate(query, queryToObfuscate)) : null,
      body: body ? safeStringify(obfuscate(body, bodyToObfuscate)) : null,
    }));
  }
  next();
};

module.exports = loggingMiddleware;
