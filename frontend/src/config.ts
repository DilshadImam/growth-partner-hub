// API Configuration for Vite
// For local development: http://localhost:5000
// For production: https://your-backend-url.com
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present
export const API_URL = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
export const API_BASE_URL = `${API_URL}/api`;

