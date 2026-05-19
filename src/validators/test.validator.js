const Joi = require('joi');

const recordTestSchema = Joi.object({
  downloadSpeed: Joi.number().positive().required(),
  uploadSpeed: Joi.number().positive().required(),
  ping: Joi.number().positive().required(),
  jitter: Joi.number().min(0).required(),
  ispProvider: Joi.string().trim().allow('', null).default('unknown'),
  testTime: Joi.date().default(() => new Date()),
});

module.exports = { recordTestSchema };
