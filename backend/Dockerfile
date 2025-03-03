FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY tsconfig.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY src ./src

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"] 