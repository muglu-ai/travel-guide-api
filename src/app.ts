import express, { Express } from 'express';
import cors from 'cors';
import baseRoutes from './routes/baseRoutes';
import cityRoutes from './routes/cityRoutes';
import placeRoutes from './routes/placeRoutes';
import serviceRoutes from './routes/serviceRoutes';
import stateRoutes from './routes/stateRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
// Swagger imports
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app: Express = express();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel Guide API',
      version: '1.0.0',
      description: 'API documentation for the Travel Guide backend',
    },
    servers: [
      {
        url: '/'
      }
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', baseRoutes);
app.use('/cities', cityRoutes);
app.use('/places', placeRoutes);
app.use('/services', serviceRoutes);
app.use('/states', stateRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
