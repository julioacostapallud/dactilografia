import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { apiService } from '../api';

interface PageVisitData {
  pageUrl: string;
  referrerUrl?: string;
  userId?: string;
}

export const usePageVisit = (pageUrl: string) => {
  const { user } = useAuth();
  const visitIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const registerVisit = async () => {
      try {
        const visitData: PageVisitData = {
          pageUrl,
          referrerUrl: document.referrer || undefined,
          userId: user?.email || undefined
        };

        const response = await fetch(`${apiService.getBaseUrl()}/api/visits`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData),
        });

        const data = await response.json();
        
        if (data.success) {
          visitIdRef.current = data.visitId;
          console.log('Visita registrada:', data.message);
        }
      } catch (error) {
        console.error('Error registrando visita:', error);
      }
    };

    // Registrar visita al cargar la página
    registerVisit();

    // Función para actualizar el tiempo de visita al salir
    const handleBeforeUnload = async () => {
      if (visitIdRef.current) {
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        try {
          await fetch(`${apiService.getBaseUrl()}/api/visits`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              visitId: visitIdRef.current,
              timeOnPageSeconds: timeOnPage
            }),
          });
        } catch (error) {
          console.error('Error actualizando tiempo de visita:', error);
        }
      }
    };

    // Función para actualizar el tiempo de visita al cambiar de página
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && visitIdRef.current) {
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        try {
          await fetch(`${apiService.getBaseUrl()}/api/visits`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              visitId: visitIdRef.current,
              timeOnPageSeconds: timeOnPage
            }),
          });
        } catch (error) {
          console.error('Error actualizando tiempo de visita:', error);
        }
      }
    };

    // Event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Actualizar tiempo al desmontar el componente
      if (visitIdRef.current) {
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        fetch(`${apiService.getBaseUrl()}/api/visits`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitId: visitIdRef.current,
            timeOnPageSeconds: timeOnPage
          }),
        }).catch(error => {
          console.error('Error actualizando tiempo de visita al desmontar:', error);
        });
      }
    };
  }, [pageUrl, user?.email]);

  return { visitId: visitIdRef.current };
};
