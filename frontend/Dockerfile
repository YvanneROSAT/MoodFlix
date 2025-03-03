FROM node:18-alpine as build

WORKDIR /app

# Définition de la variable d'environnement pour le build
ARG VITE_BACKEND_API_URL=http://localhost:7002
ENV VITE_BACKEND_API_URL=${VITE_BACKEND_API_URL}

# Copie des fichiers de dépendances
COPY frontend/package*.json ./
COPY frontend/vite.config.ts ./
COPY frontend/tsconfig.json ./
COPY frontend/tsconfig.node.json ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY frontend/src ./src
COPY frontend/index.html ./

# Build de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie des fichiers de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copie de la configuration Nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 