import BaseController from './base.controller';
import db from './../../lib/db';
import sendgrid from './../../lib/sendgrid';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import moment from 'moment';

class UsersController extends BaseController {
  whitelist = {
    firstname: false,
    lastname: false,
    username: true,
    password: true,
  };

  create = async (req, res, next) => {
    try {
      let params = this.filterParams(req.body, this.whitelist);
      params = await this.requiredParams(params, this.whitelist);

      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(req.body.password, salt);

      const len = 32;
      const token = crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, len); // return required number of characters

      const [user] = await db.user.create(params, hash, token, moment().add(1, 'hours').calendar());

      if (user.length > 0) {
        await sendgrid.sendVerifyMail(user.email, token);

        return res.status(201).json({
          message: `Verification email sent on ${user.email}.`,
        });
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  }
}

export default new UsersController();
