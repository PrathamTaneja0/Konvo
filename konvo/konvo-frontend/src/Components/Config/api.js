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
    return Promise.reject(error);
  }
);