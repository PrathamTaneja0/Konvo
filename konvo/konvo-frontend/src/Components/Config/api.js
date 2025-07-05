import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

// Add a request interceptor to set JWT dynamically
api.interceptors.request.use(
  (config) => {
    // Do not set Authorization header for public news endpoint
    if (config.url && config.url.includes('/api/news')) {
      delete config.headers["Authorization"];
    } else {
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        config.headers["Authorization"] = `Bearer ${jwt}`;
      } else {
        delete config.headers["Authorization"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;
    
    // Log errors for debugging
    console.error(`API Error ${statusCode}:`, errorMessage);
    
    // Handle specific error types
    if (statusCode === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('jwt');
      window.location.href = '/auth';
    }
    
    return Promise.reject({
      ...error,
      userMessage: getErrorMessage(statusCode, errorMessage)
    });
  }
);

// Helper function to get user-friendly error messages
const getErrorMessage = (statusCode, serverMessage) => {
  switch (statusCode) {
    case 400:
      return serverMessage || 'Invalid request. Please check your input.';
    case 401:
      return 'Please log in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return serverMessage || 'An unexpected error occurred.';
  }
};