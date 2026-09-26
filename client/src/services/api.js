import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // If unauthorized and has expired token, clear storage
    if (error.response?.status === 401 && localStorage.getItem('shopsphere_token')) {
      // Don't auto-redirect on login or register endpoints
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('shopsphere_token');
        localStorage.removeItem('shopsphere_user');
      }
    }

    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;
