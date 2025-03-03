FROM node:18-alpine as build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY src ./src
COPY public ./public
COPY index.html ./

# Build de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie des fichiers de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copie de la configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 