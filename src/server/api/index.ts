import express from 'express';
import cors from 'cors';
import { errorHandler } from '../middleware/errorMiddleware';
import routes from '../routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Error handling
app.use(errorHandler);

export default app;
