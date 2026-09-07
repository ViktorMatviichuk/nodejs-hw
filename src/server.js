import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errors } from 'celebrate';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();

  const app = express();

  // Middleware
  app.use(logger);
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  // Маршрути
  app.use(authRoutes);
  app.use(notesRoutes);

  // Обробка неіснуючих маршрутів
  app.use(notFoundHandler);

  // Обробка помилок celebrate
  app.use(errors());

  // Глобальна обробка помилок
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
