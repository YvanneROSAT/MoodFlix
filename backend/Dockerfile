FROM node:18-alpine

WORKDIR /app

# Installation des dépendances globales nécessaires
RUN npm install -g typescript ts-node

# Copie des fichiers de configuration
COPY src/package*.json ./
COPY src/tsconfig.json ./

# Installation des dépendances
RUN npm install

# Copie des sources
COPY src/src ./src

# Build TypeScript avec plus de détails en cas d'erreur
RUN npx tsc --project tsconfig.json

# Vérification que le build a bien été créé
RUN ls -la dist/

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["node", "dist/index.js"] 