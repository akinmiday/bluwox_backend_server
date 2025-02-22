import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import tasksRoutes from './routes/tasksRoutes';

export function createApp() {
  const app = express();


// Middlewares
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
