FROM node:18-alpine

# Installation de wget pour les healthchecks
RUN apk add --no-cache wget

WORKDIR /app

# Copie des fichiers de configuration
COPY backend/package*.json ./
COPY backend/tsconfig.json ./

# Installation des dépendances (inclut devDeps pour le build TypeScript)
RUN npm install

# Copie des sources
COPY backend/src ./src

# Build TypeScript
RUN npx tsc --project tsconfig.json

# Suppression des devDependencies pour alléger l'image
RUN npm prune --production

# Vérification que le build a bien été créé
RUN ls -la dist/

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=7002

# Exposition du port (Railway injecte $PORT dynamiquement)
EXPOSE ${PORT:-7002}

# Démarrage de l'application
CMD ["node", "dist/index.js"]
