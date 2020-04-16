
const express = require('express');
const aseMiddleware = require('aws-serverless-express/middleware');
const cors = require('cors');
const { validate } = require('express-validation');

const httpbinController = require('./controllers/httpbin');
const errorMiddleware = require('./middlewares/errorMiddleware');
const loggingMiddleware = require('./middlewares/loggingMiddleware');
const httbinValidator = require('./validators/httpbin');

const validationOptions = { keyByField: true, context: true };

module.exports = () => {
  const app = express();

  return app
    .disable('x-powered-by')
    .use(cors())
    .use(express.json())
    .use(aseMiddleware.eventContext())
    .use(loggingMiddleware({ loggingRequest: true }))
    .get(
      '/v1/httpbin',
      validate(httbinValidator.get, validationOptions),
      httpbinController.get,
    )
    .use(errorMiddleware);
};
