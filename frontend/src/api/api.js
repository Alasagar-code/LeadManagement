// src/api/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "https://leadmanagement-a7y0.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

export default api;
