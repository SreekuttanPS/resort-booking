import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bookingsRoutes from './routes/bookings';
import { errorHandler } from './utils/errorHandler';

export const createApp = (): Express => {
  const app = express();

  app.use(
    cors({
      origin: [process.env.FRONTEND_URL || ''],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Resort Booking API is running',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/health', (_req: Request, res: Response) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    
    res.json({
      status: 'ok',
      database: isDbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/bookings', bookingsRoutes);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  app.use(errorHandler);

  return app;
};

