export const API_BASE_URL = "http://localhost:8080";

import axios from "axios";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
    "Content-Type": "application/json"
  }
});

// Add a request interceptor to set JWT dynamically
api.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      config.headers["Authorization"] = `Bearer ${jwt}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);