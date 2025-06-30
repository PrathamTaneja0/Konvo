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
    console.log("API Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      }
    });
    return Promise.reject(error);
  }
);