'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { API_BASE_URL, API_ENDPOINTS } from '../../lib/config';

export default function PageVisitTracker() {
  const pathname = usePathname();
  const visitStartTime = useRef<number>(Date.now());
  const visitId = useRef<number | null>(null);

  useEffect(() => {
    // Registrar inicio de visita
    const recordVisit = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.pageVisits}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pageUrl: `${window.location.origin}${pathname}`,
            referrerUrl: document.referrer || null,
            ipAddress: null, // Se obtendrá del servidor
            userAgent: navigator.userAgent,
            deviceType: getDeviceType(),
            browser: getBrowser(),
            os: getOS(),
            country: null, // Se puede obtener con servicios de geolocalización
            city: null,
            sessionId: getSessionId(),
            userId: null // Se puede obtener del contexto de autenticación
          }),
        });

        const result = await response.json();
        if (result.success) {
          visitId.current = result.data.id;
        }
      } catch (error) {
        console.error('Error recording page visit:', error);
      }
    };

    recordVisit();

    // Registrar fin de visita cuando el usuario sale de la página
    const handleBeforeUnload = () => {
      if (visitId.current) {
        const timeOnPage = Math.floor((Date.now() - visitStartTime.current) / 1000);
        
        // Usar sendBeacon para enviar datos antes de que se cierre la página
        const data = JSON.stringify({
          id: visitId.current,
          timeOnPageSeconds: timeOnPage
        });

        navigator.sendBeacon(`${API_BASE_URL}${API_ENDPOINTS.pageVisits}`, data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  // Funciones auxiliares para detectar información del dispositivo
  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  };

  const getBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOS = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

  const getSessionId = () => {
    // Generar un ID de sesión único para esta visita
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', Math.random().toString(36).substring(2, 15));
    }
    return sessionStorage.getItem('sessionId');
  };

  return null; // Este componente no renderiza nada
}
