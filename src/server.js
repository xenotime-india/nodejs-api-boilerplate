/**
 * Created by sandeepkumar on 08/05/17.
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import chalk from 'chalk';

import routes from './routes';
import config from 'config';

const app = express();

// Helmet helps you secure your Express apps by setting various HTTP headers
// https://github.com/helmetjs/helmet
app.use(helmet());

// Enable CORS with various options
// https://github.com/expressjs/cors
app.use(cors());

// Request logger
// https://github.com/expressjs/morgan
if (!config.test) {
  app.use(morgan('dev'));
}

// Parse incoming request bodies
// https://github.com/expressjs/body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Lets you use HTTP verbs such as PUT or DELETE
// https://github.com/expressjs/method-override
app.use(methodOverride());

// Mount public routes
// app.use('/public', express.static(`${__dirname}/public`));

// Mount API routes
app.use(config.apiPrefix, routes);

// swagger definition
const swaggerDefinition = {
  info: {
    title: config.SWAGGER_TITLE,
    version: config.SWAGGER_VERSION,
  },
  basePath: '/',
};

// options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// serve swagger
app.get('/api/swagger', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`
    Port: ${chalk.green(config.port)}
    Env: ${chalk.green(config.env)}
  `);
});

export default app;
