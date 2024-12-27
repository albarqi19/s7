import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SERVER_CONFIG } from './config/server.config';
import { errorHandler } from './middleware/errorMiddleware';
import contentsRoutes from './routes/contents.routes';
import displayRoutes from './routes/display.routes';

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    const app = express();

    // Middleware
    app.use(cors(SERVER_CONFIG.cors));
    app.use(express.json());

    // Health check
    app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

    // Routes
    app.use('/api', contentsRoutes);
    app.use('/api', displayRoutes);

    // Error handling
    app.use(errorHandler);

    // Start server
    const port = SERVER_CONFIG.port;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log('CORS configuration:', SERVER_CONFIG.cors);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();