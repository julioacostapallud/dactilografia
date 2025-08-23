// Configuración de la API - usando backend de Vercel
// Tanto en desarrollo como en producción usamos el backend de Vercel
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dactilo-backend.vercel.app';

export const API_ENDPOINTS = {
  pageVisits: '/api/page-visits',
  health: '/api/health',
  api: '/api',
} as const;
