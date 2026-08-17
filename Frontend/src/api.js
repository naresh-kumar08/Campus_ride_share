import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://campus-ride-share-u9kn.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("crs_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


