import passport from 'passport';
import Strategy from 'passport-local';
import db from './db';

export default (app) => {
  passport.use(new Strategy(db.user.authenticate));
  app.use(passport.initialize());
};
