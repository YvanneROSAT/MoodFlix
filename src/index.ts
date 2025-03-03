import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { movieRoutes } from './routes/movie.routes';
import { errorHandler } from './middleware/error.middleware';
import { OpenAIService } from './services/openai.service';

try {
  const app = express();
  const port = env.PORT || 3000;

  // Middleware
  app.use(helmet());
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Test OpenAI connection
  const openaiService = new OpenAIService();
  openaiService.testConnection()
    .then(success => {
      if (!success) {
        console.error('❌ OpenAI connection test failed');
      }
    })
    .catch(error => {
      console.error('❌ Error testing OpenAI connection:', error);
    });

  // Routes
  app.use('/api/movies', movieRoutes);

  // Error handling
  app.use(errorHandler);

  // Start server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

} catch (error) {
  console.error('Error during server initialization:', error);
  process.exit(1);
} 