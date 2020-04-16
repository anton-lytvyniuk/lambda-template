// eslint-disable-next-line import/no-unresolved
import safeStringify from 'fast-safe-stringify';
import { v4 as randomUuid } from 'uuid';

import logger from '../utils/logger';
import obfuscate from '../utils/obfuscator';

const CORRELATION_ID_HEADER_NAME = 'correlation-id';
const HEADERS_TO_OBFUSCATE = ['authorization'];

export default (params) => {
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
          path,
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

    req.app.logger = logger.extend({
      awsRequestId,
      correlation_id: correlationId,
      id,
      method,
      originalUrl,
      path,
      requestId,
    });

    if (handleFinishRequest) {
      res.on('finish', () => handleFinishRequest(req));
    }

    if (loggingRequest) {
      logger.info(safeStringify({
        body: body ? safeStringify(obfuscate(body, bodyToObfuscate)) : null,
        headers: safeStringify(obfuscate(headers, headersToObfuscate || HEADERS_TO_OBFUSCATE)),
        path: req.path || req.apiGateway.event.path,
        query: query ? safeStringify(obfuscate(query, queryToObfuscate)) : null,
      }));
    }
    next();
  };
};
