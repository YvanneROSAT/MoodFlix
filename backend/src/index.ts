import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { movieRoutes } from './routes/movie.routes';
import { errorHandler } from './middleware/error.middleware';
import { OpenAIService } from './services/openai.service';

try {
  const app = express();
  const port = Number(env.PORT) || 7002;

  // Middleware
  app.use(helmet());
  const allowedOrigins = ['http://localhost:7001', 'http://localhost:5173'];
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
  
  app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Test OpenAI connection
  const openaiService = new OpenAIService();
  openaiService.testConnection()
    .then(success => {
      if (!success) {
        console.error('❌ OpenAI connection test failed');
      } else {
        console.log('✅ OpenAI connection test successful');
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
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${port}`);
    console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV}`);
  });

} catch (error) {
  console.error('❌ Error during server initialization:', error);
  process.exit(1);
} 