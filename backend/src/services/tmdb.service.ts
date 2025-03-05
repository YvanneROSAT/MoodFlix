import axios from 'axios';
import { AppError } from '../middleware/error.middleware';
import { RedisService } from './redis.service';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  releaseYear: string;
  rating: number;
}

export class TMDBService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly imageBaseUrl: string;
  private readonly redisService: RedisService;
  private readonly cacheTTL: number = 86400; // 24 heures en secondes

  constructor(redisService?: RedisService) {
    this.apiKey = process.env.TMDB_API_KEY || '';
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    this.redisService = redisService || new RedisService();
  }

  async searchMovie(title: string, year: string): Promise<MovieDetails | null> {
    try {
      // Générer une clé de cache unique
      const cacheKey = `tmdb:movie:${title}:${year}`;
      
      // Vérifier si les données sont en cache
      const cachedData = await this.redisService.get<MovieDetails>(cacheKey);
      if (cachedData) {
        console.log(`✅ Retrieved movie data from cache for: ${title} (${year})`);
        return cachedData;
      }

      // Si pas en cache, faire l'appel API
      const response = await axios.get(`${this.baseUrl}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query: title,
          year: year
        }
      });

      const movies = response.data.results;
      if (!movies || movies.length === 0) {
        return null;
      }

      const movie = this.formatMovieDetails(movies[0]);
      
      // Stocker les résultats dans le cache
      await this.redisService.set(cacheKey, movie, this.cacheTTL);
      console.log(`✅ Cached movie data for: ${title} (${year})`);
      
      return movie;
    } catch (error) {
      console.error('Error searching movie:', error);
      throw new AppError('Failed to search movie in TMDB', 500);
    }
  }

  private formatMovieDetails(movie: TMDBMovie): MovieDetails {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterUrl: movie.poster_path ? `${this.imageBaseUrl}${movie.poster_path}` : '',
      releaseYear: movie.release_date.split('-')[0],
      rating: movie.vote_average
    };
  }
} 