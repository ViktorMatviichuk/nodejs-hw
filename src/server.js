import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectMongoDB();

  const app = express();

  // Middleware
  app.use(logger);
  app.use(express.json());
  app.use(cors());

  // Маршрути
  app.use(notesRoutes);

  // Обробка неіснуючих маршрутів
  app.use(notFoundHandler);

  // Глобальна обробка помилок
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
