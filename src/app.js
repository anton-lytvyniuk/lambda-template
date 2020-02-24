
const express = require('express');
const aseMiddleware = require('aws-serverless-express/middleware');

const httpbinController = require('./controllers/httpbin');
const errorMiddleware = require('./middlewares/errorMiddleware');
const loggingMiddleware = require('./middlewares/loggingMiddleware');

module.exports = () => {
  const app = express();

  app.disable('x-powered-by');

  return app
    .use(express.json())
    .use(aseMiddleware.eventContext())
    .use(loggingMiddleware({ loggingRequest: true }))
    .get('/v1/httpbin', httpbinController.get)
    .use(errorMiddleware);
};
