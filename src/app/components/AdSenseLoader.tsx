'use client';

import { useEffect } from 'react';

export default function AdSenseLoader() {
  useEffect(() => {
    // Cargar AdSense solo en el cliente
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3195662668662265';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      // Cleanup si es necesario
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null; // Este componente no renderiza nada
}

