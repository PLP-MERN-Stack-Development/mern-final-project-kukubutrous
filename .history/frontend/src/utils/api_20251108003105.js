import axios from "axios";

// Create an Axios instance for all HTTP requests
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:000/api", // default fallback
  withCredentials: true, // allow sending cookies if backend uses them
});

// Automatically attach JWT token to all requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired token or 401 responses automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
