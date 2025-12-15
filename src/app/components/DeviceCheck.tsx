"use client";
import { useState, useEffect } from 'react';
// import AdSenseAd from './AdSenseAd'; // No se usa en dispositivos móviles

export default function DeviceCheck({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkDevice = () => {
      if (typeof window !== 'undefined') {
        const userAgent = navigator.userAgent.toLowerCase();
        // Permitir bots conocidos incluso si parecen móviles
        const isBot = /googlebot|bingbot|yandex|baiduspider|duckduckbot|slurp|facebot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|pinterest|slackbot|whatsapp|telegram/i.test(userAgent);
        
        if (isBot) {
          setIsMobile(false);
          setIsLoading(false);
          return;
        }

        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || window.innerWidth < 768;
        setIsMobile(isMobileDevice);
        setIsLoading(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!mounted) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-green-100/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando DACTILO...</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-green-100/30">
        {/* Header simple sin publicidad */}
        <div className="w-full bg-gradient-to-r from-green-600 to-orange-600 text-white py-4">
          <div className="text-center">
            <h1 className="text-xl font-bold">DACTILO</h1>
            <p className="text-sm opacity-90">Práctica de Dactilografía</p>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">DACTILO</h1>
            <svg width="60" height="30" viewBox="0 0 40 20" className="mx-auto">
              <rect x="0" y="0" width="8" height="6" rx="1" fill="#15803d" opacity="0.9"/>
              <rect x="9" y="0" width="8" height="6" rx="1" fill="#15803d" opacity="0.7"/>
              <rect x="18" y="0" width="8" height="6" rx="1" fill="#15803d" opacity="0.5"/>
              <rect x="27" y="0" width="8" height="6" rx="1" fill="#15803d" opacity="0.3"/>
              <path d="M0 8 L35 8" stroke="#15803d" strokeWidth="1" opacity="0.6"/>
              <path d="M0 10 L30 10" stroke="#15803d" strokeWidth="1" opacity="0.4"/>
              <path d="M0 12 L25 12" stroke="#15803d" strokeWidth="1" opacity="0.2"/>
            </svg>
          </div>

          {/* Icono de computadora */}
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Mensaje */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            DACTILO es para computadoras
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Esta aplicación está diseñada específicamente para practicar dactilografía en computadoras con teclado físico. 
            Para una mejor experiencia y resultados precisos, te recomendamos usar DACTILO en tu PC o laptop.
          </p>

          {/* Características */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">¿Por qué solo PC?</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Teclado físico para práctica real
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Pantalla más grande para mejor visualización
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Medición precisa de WPM
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Experiencia optimizada para dactilografía
              </li>
            </ul>
          </div>

          {/* Botón de acción */}
          <div className="space-y-3">
            <button 
              onClick={() => window.open('https://dactilo.com.ar', '_blank')}
              className="w-full bg-gradient-to-r from-green-600 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-orange-700 transition-all duration-200"
            >
              Abrir en PC
            </button>
            
            <p className="text-xs text-gray-500">
              O copia y pega en tu navegador: <br/>
              <span className="font-mono text-green-600">dactilo.com.ar</span>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Julio Acosta - DACTILO
            </p>
          </div>
        </div>
        </div>

        {/* Footer simple sin publicidad */}
        <div className="w-full bg-gradient-to-r from-green-600 to-orange-600 text-white py-3">
          <div className="text-center">
            <p className="text-sm opacity-90">© {new Date().getFullYear()} Julio Acosta - DACTILO</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
