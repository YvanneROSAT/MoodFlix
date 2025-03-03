FROM node:18-alpine

WORKDIR /app

# Installation des dépendances globales nécessaires
RUN npm install -g typescript

# Copie des fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./

# Installation des dépendances
RUN npm install

# Copie des sources
COPY src ./src

# Build TypeScript
RUN tsc

# Vérification que le build a bien été créé
RUN ls -la dist/

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["node", "dist/index.js"] 