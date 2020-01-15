const ase = require('aws-serverless-express');

const createApp = require('./app');

const getServer = Promise
  .resolve(createApp())
  .then((app) => ase.createServer(app))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

exports.handler = (event, context) => {
  getServer.then((server) => ase.proxy(server, event, context));
};
