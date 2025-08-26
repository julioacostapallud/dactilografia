// Configuración de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dactilo-backend.vercel.app';

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Dactilo',
  description: 'Mejora tu velocidad de escritura con ejercicios de mecanografía',
  version: '1.0.0',
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  debug: process.env.NODE_ENV === 'development',
  apiTimeout: 10000, // 10 segundos
};
