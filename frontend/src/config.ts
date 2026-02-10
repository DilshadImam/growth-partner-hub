// API Configuration for Vite
// For local development: http://localhost:5000
// For production: https://your-backend-url.com
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_BASE_URL = `${API_URL}/api`;

