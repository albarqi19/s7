import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
};