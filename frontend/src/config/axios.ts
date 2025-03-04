import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor for debugging
instance.interceptors.request.use(
  config => {
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      baseURL: config.baseURL
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