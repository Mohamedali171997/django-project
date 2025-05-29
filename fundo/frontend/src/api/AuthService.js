// frontend/src/api/AuthService.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Make sure you have 'jwt-decode' installed: npm install jwt-decode

const API_URL = 'http://localhost:8000/api/';

// Function to handle user login
export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}token/`, {
            username,
            password,
        });
        if (response.data.access) {
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            return true; // Login successful
        }
        return false; // Login failed
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error; // Re-throw to be handled by the component
    }
};

// Function to log out user
export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

// Function to check if user is authenticated (has a valid token)
export const isAuthenticated = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwtDecode(token);
        // Check if the token is expired
        const currentTime = Date.now() / 1000; // in seconds
        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error("Error decoding token:", error);
        return false; // Token is invalid or expired
    }
};

// Function to get the access token
export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

// Function to get the refresh token
export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};

// Optional: Function to refresh access token (more advanced)
export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        logout(); // No refresh token, force logout
        return null;
    }
    try {
        const response = await axios.post(`${API_URL}token/refresh/`, {
            refresh: refreshToken,
        });
        localStorage.setItem("access_token", response.data.access);
        return response.data.access;
    } catch (error) {
        console.error("Token refresh failed:", error.response?.data || error.message);
        logout(); // Refresh failed, force logout
        return null;
    }
};