import axios from 'axios';

// Configure axios defaults
const instance = axios.create({
  baseURL: import.meta.env.BACKEND_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 secondes
});

// Add request interceptor for debugging
instance.interceptors.request.use(
  config => {
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      data: config.data
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
    console.error('Response error:', {
      message: error.message,
      response: error.response?.data
    });

    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      return Promise.reject({
        message: error.response.data.message || 'Une erreur est survenue',
        status: error.response.status
      });
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      return Promise.reject({
        message: 'Le serveur ne répond pas. Veuillez réessayer plus tard.',
        status: 503
      });
    } else {
      // Erreur lors de la configuration de la requête
      return Promise.reject({
        message: 'Erreur de configuration de la requête',
        status: 500
      });
    }
  }
);

export default instance; 