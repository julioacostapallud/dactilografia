// Configuración de la API - usando backend externo en Vercel
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://dactilo-backend.vercel.app' 
  : 'http://localhost:3001';

export const API_ENDPOINTS = {
  pageVisits: '/api/page-visits',
  health: '/api/health',
  api: '/api',
} as const;
