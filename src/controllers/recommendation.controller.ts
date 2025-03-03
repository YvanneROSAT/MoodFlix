import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service';
import { OpenAIService } from '../services/openai.service';
import { TMDBService } from '../services/tmdb.service';
import { AppError } from '../middleware/error.middleware';

export class RecommendationController {
  private weatherService: WeatherService;
  private openAIService: OpenAIService;
  private tmdbService: TMDBService;

  constructor() {
    this.weatherService = new WeatherService();
    this.openAIService = new OpenAIService();
    this.tmdbService = new TMDBService();
  }

  getRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('Received request:', req.body);
      const { city, userContext } = req.body;

      if (!city || typeof city !== 'string' || city.trim().length === 0) {
        throw new AppError('Une ville valide est requise', 400);
      }

      // Get weather data
      console.log('Fetching weather data for city:', city);
      const weatherData = await this.weatherService.getWeatherByCity(city);
      console.log('Weather data received:', weatherData);

      // Get AI recommendations
      console.log('Getting AI recommendations');
      const aiRecommendations = await this.openAIService.getMovieRecommendations(
        weatherData,
        userContext
      );
      console.log('AI recommendations received');

      // Enrich recommendations with TMDB data
      console.log('Enriching recommendations with TMDB data');
      const enrichedRecommendations = await Promise.all(
        aiRecommendations.recommendations.map(async (rec) => {
          const movieDetails = await this.tmdbService.searchMovie(
            rec.title,
            rec.year
          );

          return {
            ...rec,
            details: movieDetails || null
          };
        })
      );

      const response = {
        recommendations: enrichedRecommendations,
        theme: aiRecommendations.theme,
        mood: aiRecommendations.mood
      };

      console.log('Sending response');
      return res.json(response);

    } catch (error) {
      console.error('Error in getRecommendations:', error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          message: error.message
        });
      }
      next(error);
    }
  }
} 