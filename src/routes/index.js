/**
 * Created by sandeepkumar on 08/05/17.
 */
import { Router } from 'express';

import MetaController from './controllers/meta.controller';
import errorHandler from './../middleware/error-handler';

const routes = new Router();

routes.get('/', MetaController.index);

/*
// Authentication
routes.post('/auth/login', AuthController.login);

// Users
routes.get('/users', UsersController.search);
routes.post('/users', UsersController.create);
routes.get('/users/me', authenticate, UsersController.fetch);
routes.put('/users/me', authenticate, UsersController.update);
routes.delete('/users/me', authenticate, UsersController.delete);
routes.get('/users/:username', UsersController._populate, UsersController.fetch);

// Post
routes.get('/posts', PostsController.search);
routes.post('/posts', authenticate, PostsController.create);
routes.get('/posts/:id', PostsController._populate, PostsController.fetch);
routes.delete('/posts/:id', authenticate, PostsController.delete);

// Admin
routes.get('/admin', accessControl('admin'), MetaController.index);
*/

routes.use(errorHandler);

export default routes;
