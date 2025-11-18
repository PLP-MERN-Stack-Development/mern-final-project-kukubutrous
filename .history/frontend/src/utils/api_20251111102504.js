
//frontend/src/utils/api.jsx
import axios from "axios";

// Base API instance

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// Request interceptor to attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
