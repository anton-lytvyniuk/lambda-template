const createApp = require('./app');

const port = process.env.PORT || 3000;

Promise
  .resolve(createApp())
  .then((app) => app
    .listen(port, (err) => (err
      ? console.error(err)
      : console.log(`listening on ${port}`))))
  .catch(console.error);
