import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorMiddleware';
import routes from './routes';
import { Logger } from './services/logger';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  Logger.info(`Server running on port ${port}`);
});