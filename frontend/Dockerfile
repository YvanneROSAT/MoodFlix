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

# Copie du template Nginx (sera traité par envsubst au démarrage)
COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template

ENV PORT=80

EXPOSE ${PORT}

CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
