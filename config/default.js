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
  root: path.normalize(__dirname + '/..'),
  port: process.env.PORT || 3000,
  apiPrefix: '/api', // Could be /api/resource or /api/v2/resource
  DATABASE_URL: process.env.DATABASE_URL,
  SWAGGER_TITLE:'',
  SWAGGER_VERSION: '',
};
