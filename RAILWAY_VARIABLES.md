# Variables d'environnement Railway — MoodFlix

## Service : Backend

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `OPENAI_API_KEY` | `<ta clé OpenAI>` |
| `OPENWEATHER_API_KEY` | `<ta clé OpenWeather>` |
| `TMDB_API_KEY` | `<ta clé TMDB>` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` (référence au service Redis Railway) |
| `REDIS_TTL` | `3600` |
| `FRONTEND_URL` | `https://${{Frontend.RAILWAY_PUBLIC_DOMAIN}}` |

## Service : Frontend (build-time)

| Variable | Valeur |
|----------|--------|
| `VITE_BACKEND_API_URL` | `https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}` |

## Service : Redis

Aucune variable manuelle — Railway provisionne automatiquement le Redis et expose `REDIS_URL`.
