/**
 * Created by sandeepkumar on 08/05/17.
 */
import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import errorHandler from './../middleware/error-handler';
import auth from './../middleware/authenticate';
import AuthController from './controllers/auth.controller';
import UsersController from './controllers/users.controller';

const routes = new Router();

routes.get('/', MetaController.index);

// Authentication
/**
 * @swagger
 * definition:
 *   error:
 *     properties:
 *      message:
 *         type: string
 *      stack:
 *         type: string
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - auth
 *     description: Returns token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: password
 *           example: {
 *             "username": "someUser",
 *             "password": "somePassword"
 *           }
 *
 *     responses:
 *       200:
 *         description: token
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             accessToken:
 *                type: string
 *             refreshToken:
 *                type: string
 *             expiresIn:
 *                type: integer
 *           example: {
 *             "accessToken": "jwt token string",
 *             "refreshToken": "jwt token string",
 *             "expiresIn": 1342344434
 *           }
 *       403:
 *         description: Forbidden
 *         schema:
 *             $ref: '#/definitions/error'
 */
routes.post('/auth/login', auth.passportAuthenticate, AuthController.login);

/**
 * @swagger
 * /api/auth/verifyemail/{token}:
 *   get:
 *     tags:
 *       - auth
 *     description: Verify user email address
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         type: string
 *
 *     responses:
 *       200:
 *         description: success
 *       500:
 *         description: error
 *         schema:
 *             $ref: '#/definitions/error'
 */
routes.get('/auth/verifyEmail/:token', AuthController.verifyEmail);

/**
 * @swagger
 * /api/auth/resendVerificationEmail:
 *   post:
 *     tags:
 *       - auth
 *     description: resend Verification Email to user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *               type: string
 *           example: {
 *             "username": "someUser"
 *           }
 *
 *     responses:
 *       200:
 *         description: email sent
 *       500:
 *         description: Error
 *         schema:
 *             $ref: '#/definitions/error'
 */
routes.post('/auth/resendVerificationEmail', AuthController.resendVerificationEmail);

/**
 * @swagger
 * /api/user/create:
 *   post:
 *     tags:
 *       - user
 *     description: Create new user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *             - firstname
 *             - lastname
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: password
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string
 *           example: {
 *             "username": "someUser",
 *             "password": "somePassword",
 *             "firstname": "firstname",
 *             "lastname": "lastname",
 *           }
 *
 *     responses:
 *       200:
 *         description: user detail
 *       500:
 *         description: error
 */
routes.post('/user/create', UsersController.create);

/**
 * @swagger
 * /api/me:
 *   get:
 *     tags:
 *       - (secure) me
 *     description: Returns current user information
 *     security:
 *       - jwt: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: token
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *         examples:
 *           application/json: {
 *             "id": 1,
 *             "username": "someuser"
 *           }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: error
 */
routes.get('/me', auth.authenticate, MetaController.index);
/*
routes.get('/admin', accessControl('admin'), MetaController.index);
*/

routes.use(errorHandler);

export default routes;
