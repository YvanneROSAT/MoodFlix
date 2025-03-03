FROM node:18-alpine

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apk add --no-cache wget

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

# Build TypeScript
RUN npx tsc --project tsconfig.json

# Vérification que le build a bien été créé
RUN ls -la dist/

# Exposition du port
EXPOSE 7002

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=7002

# Démarrage de l'application avec logs
CMD ["sh", "-c", "\
    echo '🚀 Starting server...' && \
    echo '📝 Environment:' && \
    env | sort && \
    echo '⚙️ Starting Node.js server...' && \
    node dist/index.js"] 