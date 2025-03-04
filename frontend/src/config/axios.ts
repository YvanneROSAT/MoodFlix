import axios from 'axios';

// En production, on veut juste ajouter /api au début des requêtes
const baseURL = import.meta.env.PROD ? '/api' : import.meta.env.VITE_BACKEND_API_URL;

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor for debugging
instance.interceptors.request.use(
  config => {
    // En prod, on s'assure que l'URL commence par /api seulement si baseURL ne le contient pas déjà
    if (import.meta.env.PROD && !config.baseURL?.includes('/api') && !config.url?.startsWith('/api')) {
      config.url = `/api${config.url || ''}`;
    }
    
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL || ''}${config.url || ''}`
    });
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  response => {
    console.log('Response received:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response error:', error);

    if (error.response) {
      return Promise.reject({
        message: error.response.data.message || 'Une erreur est survenue',
        status: error.response.status
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'Le serveur ne répond pas. Veuillez réessayer plus tard.',
        status: 503
      });
    } else {
      return Promise.reject({
        message: 'Erreur de configuration de la requête',
        status: 500
      });
    }
  }
);

export default instance; 