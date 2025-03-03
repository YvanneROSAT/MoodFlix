import axios from 'axios';
import { AppError } from '../middleware/error.middleware';

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

  constructor() {
    this.apiKey = process.env.TMDB_API_KEY || '';
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  }

  async searchMovie(title: string, year: string): Promise<MovieDetails | null> {
    try {
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

      const movie = movies[0];
      return this.formatMovieDetails(movie);
    } catch (error) {
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