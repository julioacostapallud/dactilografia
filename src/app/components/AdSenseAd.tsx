'use client';

import { useEffect, useRef } from 'react';

// Declaración de tipo para Google AdSense
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: string;
  className?: string;
}

export default function AdSenseAd({ adSlot, adFormat = 'auto', className = '' }: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined' && adRef.current) {
      try {
        // Verificar si adsbygoogle está disponible
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.log('AdSense not ready yet:', error);
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-3195662668662265"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
