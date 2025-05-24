// frontend/src/api/AuthService.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/token/";

export const login = async (username, password) => {
  const response = await axios.post(API_URL, { username, password });
  if (response.data.access) {
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const getAccessToken = () => {
  return localStorage.getItem("access");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh");
};
