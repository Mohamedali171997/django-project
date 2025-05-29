// frontend/src/axiosConfig.js (confirm this content)
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/', // Your Django API base URL
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token'); // Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh or logout on 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If the error is 401 Unauthorized and it's not the login/refresh endpoint
        if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== 'token/' && originalRequest.url !== 'token/refresh/') {
            originalRequest._retry = true; // Mark request as retried
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });
                    localStorage.setItem('access_token', response.data.access);
                    // Retry the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                    return api(originalRequest); // Use the exported 'api' instance
                }
            } catch (refreshError) {
                console.error("Refresh token failed, logging out:", refreshError);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default api; // Ensure 'api' is exported as default