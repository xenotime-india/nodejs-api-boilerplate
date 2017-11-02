import BaseController from './base.controller';
import config from 'config';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import moment from 'moment';
import sendgrid from './../../lib/sendgrid';
import db from './../../lib/db';
import crypto from 'crypto';

class AuthController extends BaseController {
  whitelist = {
    username: true,
    password: true,
  };

  login = async (req, res, next) => {
    try {
      await db.user.update(req.user);

      let expiresIn = config.JWT_TOKEN_TIME_OUT;
      let expiresInMs = ms(expiresIn);
      let expiresInDate = moment().add('ms', expiresInMs);

      let accessToken = jwt.sign({
        id: req.user.id,
      }, config.JWT_SECRET, {
        expiresIn: config.JWT_TOKEN_TIME_OUT,
      });

      let refreshTokenPayload = { id: req.user.id, created_at: new Date() };
      let refreshToken = jwt.sign(refreshTokenPayload, config.JWT_SECRET);

      const token = {
        accessToken,
        refreshToken,
        expiresIn: expiresInDate.toDate().getTime(),
      };

      return res.status(200).json(token);
    } catch (err) {
      next(Object.assign({}, err, { status: 400 }));
    }
  }

  verifyEmail = async (req, res, next) => {
    const { token } = req.params;

    try {
      const [user] = await db.user.verify({ token });

      if (user) {
        return res.status(200).json({
          user,
          message: `Successfully Verified your email. Welcome  ${user.email}.`,
        });
      } else {
        throw new Error('User Verification token is invalid or has expired.');
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  }

  resetPasswordRequest = async (req, res, next) => {
    const { username } = req.body;

    try {
      if (username) {
        const user = await db.user.getUserByEmail(username);
        if (user && !user.verified) {
          const len = 32;
          const token = crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len); // return required number of characters

          await db.user.resetPasswordToken(user, token, moment().add(1, 'hours').calendar());

          await sendgrid.sendVerifyMail(user.email, token);

          return res.status(201).json({
            message: `Reset Password link sent to ${user.email} address.`,
          });
        } else {
          throw new Error('username is invalid.');
        }
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  }

  resetPasswordVerification = async (req, res, next) => {
    const { username } = req.body;

    try {
      if (username) {
        const user = await db.user.getUserByEmail(username);
        if (user && !user.verified) {
          const len = 32;
          const token = crypto.randomBytes(Math.ceil(len / 2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len); // return required number of characters

          await db.user.resetPasswordToken(user, token, moment().add(1, 'hours').calendar());

          await sendgrid.sendVerifyMail(user.email, token);

          return res.status(201).json({
            message: `Reset Password link sent to ${user.email} address.`,
          });
        } else {
          throw new Error('username is not valid.');
        }
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  }

  resendVerificationEmail = async (req, res, next) => {
    const { username } = req.body;

    try {
      if (username) {
        const user = await db.user.getUserByEmail(username);
        if (user && !user.verified) {
          const len = 32;
          const token = crypto.randomBytes(Math.ceil(len/2))
            .toString('hex') // convert to hexadecimal format
            .slice(0, len); // return required number of characters

          await db.user.resetVerifyToken(user, token, moment().add(1, 'hours').calendar());

          await sendgrid.sendVerifyMail(user.email, token);

          return res.status(201).json({
            message: `Verification email sent on ${user.email}.`,
          });
        } else {
          throw new Error('username is not valid or already verified.');
        }
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  }
}

export default new AuthController();
