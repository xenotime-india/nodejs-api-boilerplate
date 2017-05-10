import BaseController from './base.controller';
import config from 'config';
import jwt from 'jsonwebtoken';

class AuthController extends BaseController {
  login(req, res, next) {
    const { username, password } = req.body;

    try {

      if (!username || username !== password) {
        const err = new Error('Please verify your credentials.');
        err.status = 401;
        return next(err);
      }

      const token = user.generateToken();
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }

  _generateToken(user) {
    return jwt.sign({ _id: user.username }, config.security.sessionSecret, {
      expiresIn: config.security.sessionExpiration,
    });
  }
}

export default new AuthController();
