const createApp = require('./app');
const { logger } = require('./utils/logger');

const port = process.env.PORT || 3000;

Promise
  .resolve(createApp())
  .then((app) => app
    .listen(port, (err) => (err
      ? logger.error(err)
      : logger.log(`listening on ${port}`))))
  .catch(logger.error);
