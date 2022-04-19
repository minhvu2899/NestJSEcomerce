import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  CLIENT_ID: Joi.string().required(),
  DOMAIN_EMAIL: Joi.string().required(),
  API_KEY: Joi.string().required(),
  // CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  // CLOUDINARY_API_KEY: Joi.string().required(),
  // CLOUDINARY_API_SECRET: Joi.string().required(),
});
