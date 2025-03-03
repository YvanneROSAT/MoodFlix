import path from 'path';
import { config } from 'dotenv-safe';

// Initialize environment configuration
const initializeEnv = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const examplePath = path.resolve(process.cwd(), '.env.example');
    
    // En production, on ne vérifie pas le fichier .env.example
    if (process.env.NODE_ENV === 'production') {
      config({
        path: envPath,
        allowEmptyValues: true,
      });
    } else {
      config({
        path: envPath,
        example: examplePath,
        allowEmptyValues: false,
      });
    }
    
    // Validate required environment variables
    const requiredEnvVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      FRONTEND_URL: process.env.FRONTEND_URL,
    };
    
    return requiredEnvVars;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    process.exit(1);
  }
};

export const env = initializeEnv(); 