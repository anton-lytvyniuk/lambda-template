const { Joi } = require('express-validation');

exports.get = {
  query: Joi.object({
    somefield: Joi.string(),
  }),
};
