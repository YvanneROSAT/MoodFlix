import axios from 'axios';
import { AppError } from '../middleware/error.middleware';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    if (!this.apiKey) {
      throw new AppError('OpenWeather API key is missing', 500);
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    console.log('=== Début getWeatherByCity ===');
    console.log('Paramètres reçus:', {
      city,
      apiKeyPresent: !!this.apiKey,
      baseUrl: this.baseUrl
    });

    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric&lang=fr`;
      console.log('URL de requête (sans API key):', url.replace(this.apiKey, 'HIDDEN'));

      const response = await axios.get(this.baseUrl, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          lang: 'fr'
        }
      });

      console.log('Réponse API météo:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });

      const { main, weather, wind } = response.data;

      const weatherData = {
        temperature: Math.round(main.temp),
        condition: weather[0].main,
        humidity: main.humidity,
        windSpeed: wind.speed
      };

      console.log('Données météo traitées:', weatherData);
      console.log('=== Fin getWeatherByCity - Succès ===');
      return weatherData;

    } catch (error) {
      console.error('=== Erreur dans getWeatherByCity ===');
      console.error('Détails de l\'erreur:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        isAxiosError: axios.isAxiosError(error),
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : null
      });
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new AppError('Ville non trouvée. Veuillez vérifier l\'orthographe.', 404);
        }
        if (error.response?.status === 401) {
          throw new AppError('Erreur d\'authentification avec l\'API météo.', 401);
        }
        if (error.response?.data?.message) {
          throw new AppError(`Erreur météo: ${error.response.data.message}`, error.response.status);
        }
      }
      
      console.error('=== Fin getWeatherByCity - Erreur ===');
      throw new AppError('Impossible de récupérer les données météo. Veuillez réessayer.', 500);
    }
  }
} 