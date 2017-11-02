import config from 'config';
import passport from 'passport';
import expressJwt from 'express-jwt';

export default {
  authenticate: expressJwt({
    secret: config.JWT_SECRET,
  }),

  passportAuthenticate: passport.authenticate(
    'local', {
      session: false,
      scope: [],
    }),
};
