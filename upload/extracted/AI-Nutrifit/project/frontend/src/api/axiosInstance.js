import axios from "axios";

const API = axios.create({
  // Force it to point to your backend port, not the React port
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  // This is CRITICAL for sending the JWT cookie back and forth
  withCredentials: true,
});

export default API;
