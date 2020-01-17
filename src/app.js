
const express = require('express');
const aseMiddleware = require('aws-serverless-express/middleware');

const httpbinController = require('./controllers/httpbin');
const errorHandler = require('./midelwares/errorHandler');
const loggingMidleware = require('./midelwares/logging');

module.exports = () => {
  const app = express();

  app.disable('x-powered-by');

  return app
    .use(express.json())
    .use(aseMiddleware.eventContext())
    .use(loggingMidleware({ loggingRequest: true }))
    .get('/v1/httpbin', httpbinController.get)
    .use(errorHandler);
};
