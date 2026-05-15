/**
 * Central API Configuration
 * 
 * In development, it defaults to localhost.
 * In production, it will use the URL provided in the VITE_API_URL environment variable.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default API_BASE_URL;
