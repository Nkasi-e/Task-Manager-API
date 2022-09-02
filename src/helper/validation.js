const Joi = require("joi");

const authSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(/[a-zA-Z0-9]{3,30}/)
    .required(),
});

module.export = { authSchema };
