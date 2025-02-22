import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import tasksRoutes from './routes/tasksRoutes';

export function createApp() {
  const app = express();

  // Security Middleware
  app.use(helmet());

  // Rate Limiting Middleware
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);

  // Other Middlewares
  app.use(cors());
  app.use(express.json());

  // Auth routes
  app.use('/auth', authRoutes);

  // Tasks routes
  app.use('/tasks', tasksRoutes);

  // Health check or default route
  app.get('/', (req, res) => {
    res.send('Bluwox backend API is running...');
  });

  return app;
}
