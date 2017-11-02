/**
 * Created by sandeepkumar on 08/05/17.
 */
const path = require('path');
require('dotenv').config();

// Default configuations applied to all environments
module.exports = {
  version: '1.0.0',
  env: process.env.NODE_ENV,
  test: process.env.NODE_ENV === 'test',
  development: process.env.NODE_ENV === 'development',
  production: process.env.NODE_ENV === 'production',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH || 'resecret',
  JWT_TOKEN_TIME_OUT: process.env.JWT_TOKEN_TIME_OUT || '1m',
  JWT_REFRESH_TOKEN_TIME_OUT: process.env.JWT_REFRESH_TOKEN_TIME_OUT || '7d',
  root: path.normalize(__dirname + '/..'),
  PORT: process.env.PORT || 3000,
  apiPrefix: process.env.API_PREFIX || '/api', // Could be /api/resource or /api/v2/resource
  DATABASE_URL: process.env.DATABASE_URL,
  SWAGGER_TITLE: '',
  SWAGGER_VERSION: '',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FROM_EMAIL_ADDRESS: process.env.FROM_EMAIL_ADDRESS,
  VERIFY_EMAIL_URL: process.env.VERIFY_EMAIL_URL,
  HOST: process.env.HOST || 'localhost',
  verifyEmailUrl: 'api/auth/verifyEmail',
  userRoles: ['user', 'admin', 'super-admin'],
};
