// Update with your config settings.
const config = require('config');

console.log(config.DATABASE_URL);

module.exports = {
  client: 'pg',
  connection: config.DATABASE_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
