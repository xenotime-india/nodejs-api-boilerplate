
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').raw('CREATE TYPE role AS ENUM (\'admin\', \'super-admin\')'),
    knex.schema.withSchema('public').createTableIfNotExists('users', function(table) {
      table.increments('id').notNullable().primary();
      table.string('firstname');
      table.string('lastname');
      table.string('email').unique();
      table.string('password');
      table.boolean('verified');
      table.specificType('roles', 'role');
      table.string('reset_password_token');
      table.timestamp('reset_password_expires');
      table.string('verification_token');
      table.timestamp('verification_expires');
      table.timestamp('last_login').defaultTo(knex.fn.now());
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.withSchema('public').dropTableIfExists('users'),
      knex.schema.raw('DROP TYPE role'),
    ]);
};
