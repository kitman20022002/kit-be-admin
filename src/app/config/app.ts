/* eslint-disable no-secrets/no-secrets */
import dotenv from 'dotenv';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();

module.exports = {
  name: process.env.NAME || 'techscrumapp',
  port: process.env.PORT || 8000,
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
  version: '1.0.0',
  db: process.env.MONGODB_URL,
};
