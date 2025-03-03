import path from 'path';
import { config } from 'dotenv-safe';

// Initialize environment configuration
const initializeEnv = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const examplePath = path.resolve(process.cwd(), '.env.example');
    
    // En production, on utilise les variables d'environnement directement
    if (process.env.NODE_ENV === 'production') {
      // On ne charge pas le fichier .env en production
      // Les variables sont injectées par Docker/Coolify
      return {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT || '7002',
        BACKEND_PORT: process.env.BACKEND_PORT || '7002',
        FRONTEND_PORT: process.env.FRONTEND_PORT || '7001',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
        TMDB_API_KEY: process.env.TMDB_API_KEY,
        FRONTEND_URL: process.env.FRONTEND_URL,
      };
    }
    
    // En développement, on charge le fichier .env
    config({
      path: envPath,
      example: examplePath,
      allowEmptyValues: false,
    });
    
    return {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      BACKEND_PORT: process.env.BACKEND_PORT,
      FRONTEND_PORT: process.env.FRONTEND_PORT,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      FRONTEND_URL: process.env.FRONTEND_URL,
    };
  } catch (error) {
    console.error('Error loading environment variables:', error);
    process.exit(1);
  }
};

export const env = initializeEnv(); 