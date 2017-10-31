import config from 'config';
import AppError from './../lib/error';
import moment from 'moment';
import bcrypt from 'bcryptjs';

const knex = require('knex')({
  client: 'pg',
  connection: config.DATABASE_URL,
  searchPath: 'public',
  ssl: config.NODE_ENV === 'production',
});

export default {
  user: {
    verify: ({ token }) => {
      return knex('users').where('verification_token', token)
        .first()
        .then((result) => {
          if (result && moment(result.verification_expires).diff(moment()) > 0 ) {
            return knex('users').where('id', result.id)
              .update({
                verified: true,
                verification_token: null,
                verification_expires: null,
              }, true)
              .returning(['firstname', 'lastname', 'email']);
          } else {
            throw new AppError('verification token expired.');
          }
        });
    },
    resetVerifyToken: (user, verificationToken, verificationExpires) => {
      return knex('users').where('id', user.id)
        .update({
          verification_token: verificationToken,
          verification_expires: verificationExpires,
        }, true)
        .returning(['firstname', 'lastname', 'email']);
    },
    resetPasswordToken: (user, token, expires) => {
      return knex('users').where('id', user.id)
        .update({
          reset_password_token: token,
          reset_password_expires: expires,
        }, true)
        .returning(['firstname', 'lastname', 'email']);
    },
    update: (user) => {
      return knex('users').where('id', user.id)
        .update({
          lastlogin: knex.fn.now(),
        }, true)
        .returning('*')
        .first();
    },
    select: ( condition ) => {
      return knex('users').where(condition);
    },
    getUserByEmail: (email) => {
      return knex('users').where('email', email).first();
    },
    create: (user, hash, verificationToken, verificationExpires) => {
      return knex('users')
        .insert({
          email: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          password: hash,
          verified: false,
          verification_token: verificationToken,
          verification_expires: verificationExpires,
        })
        .returning('*');
    },
    authenticate: function(username, password, cb) {
      // database dummy - find user and verify password
      knex('users').where('email', username).first()
        .then((result) => {
          if (!result) {
            cb(new AppError('Invalid UserName.', 403), false);
            return;
          }
          if (!result.verified) {
            cb(new AppError('User\'s email not verified.', 403), false);
            return;
          }
          if (!bcrypt.compareSync(password, result.password)) {
            cb(new AppError('Invalid Password.', 403), false);
            return;
          } else {
            cb(null, result);
          }
        }).catch((err) => {
          cb(err, false);
        });
    },
  },
  client: {
    // db dummy for clients
    clients: [],
    clientCount: 0,
    updateOrCreate: function(data, cb) {
      let id = this.clientCount++;
      this.clients[id] = {
        id,
        userId: data.user.id,
      };
      cb(null, {
        id,
      });
    },
    storeToken: function(data, cb) {
      this.clients[data.id].refreshToken = data.refreshToken;
      cb();
    },
    findUserOfToken: function(data, cb) {
      if (!data.refreshToken) {
        return cb(new AppError('invalid token'));
      }
      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].refreshToken === data.refreshToken) {
          return cb(null, {
            id: this.clients[i].userId,
            clientId: this.clients[i].id,
          });
        }
      }
      cb(new AppError('not found'));
    },
    rejectToken: function(data, cb) {
      for (let i = 0; i < this.clients.length; i++) {
        if (this.clients[i].refreshToken === data.refreshToken) {
          this.clients[i] = {};
          return cb();
        }
      }
      cb(new AppError('not found'));
    },
  },
};
