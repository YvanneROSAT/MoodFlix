FROM node:18-alpine

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache wget curl

# Installation des dépendances globales nécessaires
RUN npm install -g typescript ts-node

# Copie des fichiers de configuration
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/.env.example ./.env

# Installation des dépendances
RUN npm install

# Copie des sources
COPY backend/src ./src

# Build TypeScript avec plus de détails en cas d'erreur
RUN npx tsc --project tsconfig.json

# Vérification que le build a bien été créé
RUN ls -la dist/

# Exposition du port
EXPOSE 7002

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=7002 \
    OPENAI_API_KEY="" \
    OPENWEATHER_API_KEY="" \
    TMDB_API_KEY="" \
    FRONTEND_URL=http://frontend:7001

# Démarrage de l'application avec plus de logs
CMD ["sh", "-c", "echo '🚀 Starting server...' && echo '📝 Environment:' && env && echo '🌐 Network:' && ip addr && node dist/index.js"] 