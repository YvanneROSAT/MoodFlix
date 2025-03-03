import OpenAI from 'openai';
import { AppError } from '../middleware/error.middleware';
import { env } from '../config/env';

interface MovieRecommendation {
  title: string;
  year: string;
  reason: string;
}

interface RecommendationResponse {
  recommendations: MovieRecommendation[];
  theme: string;
  mood: string;
}

export class OpenAIService {
  private readonly openai: OpenAI;

  constructor() {
    const apiKey = env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new AppError('OpenAI API key is missing in environment configuration.', 500);
    }

    if (!apiKey.startsWith('sk-')) {
      throw new AppError('Invalid OpenAI API key format. The key should start with "sk-".', 500);
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey.trim(),
      });
    } catch (error) {
      console.error('Error initializing OpenAI client:', error);
      throw new AppError('Failed to initialize OpenAI client. Please check your API key.', 500);
    }
  }

  // Test connection to OpenAI API
  async testConnection(): Promise<boolean> {
    try {
      await this.openai.models.list();
      return true;
    } catch (error) {
      console.error('Failed to connect to OpenAI API:', error);
      return false;
    }
  }

  async getMovieRecommendations(
    weatherData: {
      temperature: number;
      condition: string;
      humidity: number;
    },
    userContext: string
  ): Promise<RecommendationResponse> {
    try {
      const systemPrompt = `
        Tu es un expert en cinéma qui recommande des films en fonction de la météo et du contexte personnel.
        Conditions actuelles: Température: ${weatherData.temperature}°C, Conditions: ${weatherData.condition}, Humidité: ${weatherData.humidity}%.
        Contexte utilisateur: "${userContext || "Non spécifié"}".

        Recommande 10 films adaptés à ces conditions. Ta réponse doit être un objet JSON valide avec la structure exacte suivante, sans aucun texte supplémentaire :
        {
          "recommendations": [
            {
              "title": "Titre exact du film",
              "year": "Année de sortie",
              "reason": "Explication courte de pourquoi ce film correspond à la situation actuelle"
            }
          ],
          "theme": "Thème général qui relie ces recommandations",
          "mood": "Ambiance générale des films recommandés"
        }

        Assure-toi que les titres de films sont précis pour permettre une recherche dans TMDB.
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new AppError('No recommendations generated', 500);
      }

      try {
        const parsedResponse = JSON.parse(response);
        if (!parsedResponse.recommendations || !Array.isArray(parsedResponse.recommendations)) {
          throw new AppError('Invalid response format from AI', 500);
        }
        return parsedResponse;
      } catch (parseError) {
        throw new AppError('Failed to parse AI response as JSON', 500);
      }
    } catch (error: any) {
      console.error('OpenAI API Error:', error.message);
      if (error.response) {
        console.error('OpenAI API Response:', error.response.data);
      }
      throw new AppError('Failed to generate movie recommendations: ' + error.message, 500);
    }
  }
} 