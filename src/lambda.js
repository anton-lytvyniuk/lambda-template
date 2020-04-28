const ase = require('aws-serverless-express');

const createApp = require('./app');
const { logger } = require('./utils/logger');

const getServer = Promise
  .resolve(createApp())
  .then((app) => ase.createServer(app))
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });

exports.handler = (event, context) => {
  getServer.then((server) => ase.proxy(server, event, context));
};
