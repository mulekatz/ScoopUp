import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, MAX_FILE_SIZE } from '@config';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import bodyParser from 'body-parser';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    console.log(NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, MAX_FILE_SIZE);
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeLimits();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    try {
      const port = this.port || 3000;
      console.log(`Attempting to listen on port ${port}...`);
      
      this.app.listen(Number(port), '0.0.0.0', () => {
        console.log(`🚀 App listening on the host 0.0.0.0 port ${port}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      throw error;
    }
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(
      cors({
        origin: ORIGIN,
        credentials: CREDENTIALS,
      }),
    );

    console.log(ORIGIN, CREDENTIALS);

    this.app.use(hpp());

    this.app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private initializeLimits() {
    this.app.use(bodyParser.json({ limit: MAX_FILE_SIZE }));
    this.app.use(bodyParser.urlencoded({ limit: MAX_FILE_SIZE, extended: true, parameterLimit: 50000 }));
  }
}
