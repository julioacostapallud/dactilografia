"use client";
import { useState, useEffect } from 'react';
import { FaChartLine, FaHistory, FaTrophy, FaTimes } from 'react-icons/fa';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export default function OnboardingModal({ isOpen, onClose, onRegister }: OnboardingModalProps) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Verificar si el usuario ya vio el onboarding
    const seen = localStorage.getItem('hasSeenOnboarding');
    if (seen) {
      setHasSeenOnboarding(true);
    }
  }, []);

  const handleRegister = () => {
    // Marcar que el usuario vio el onboarding
    localStorage.setItem('hasSeenOnboarding', 'true');
    onRegister();
  };

  const handleSkip = () => {
    // Marcar que el usuario vio el onboarding pero no se registró
    localStorage.setItem('hasSeenOnboarding', 'true');
    onClose();
  };

  if (!isOpen || hasSeenOnboarding || !isClient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />
              <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-w-md w-full animate-in slide-in-from-bottom-4 duration-300">
        {/* Header integrado */}
        <div className="flex justify-between items-center w-full bg-gradient-to-r from-green-600 via-green-500 to-orange-500 rounded-t-2xl p-1">
          {/* Logo + Dactilo */}
          <div className="flex items-center space-x-1">
            <svg width="30" height="15" viewBox="0 0 40 20" className="flex-shrink-0" style={{ marginTop: '6px' }}>
              <rect x="0" y="2" width="8" height="6" rx="1" fill="white" opacity="0.9"/>
              <rect x="9" y="2" width="8" height="6" rx="1" fill="white" opacity="0.7"/>
              <rect x="18" y="2" width="8" height="6" rx="1" fill="white" opacity="0.5"/>
              <rect x="27" y="2" width="8" height="6" rx="1" fill="white" opacity="0.3"/>
              <path d="M0 10 L35 10" stroke="white" strokeWidth="1" opacity="0.6"/>
              <path d="M0 12 L30 12" stroke="white" strokeWidth="1" opacity="0.4"/>
              <path d="M0 14 L25 14" stroke="white" strokeWidth="1" opacity="0.2"/>
            </svg>
            <h2 className="text-sm font-bold text-white">Dactilo</h2>
            <span className="text-white/70 text-sm">•</span>
            <span className="text-sm font-semibold text-orange-200">¡Bienvenido!</span>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white hover:text-orange-300 transition-colors">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Contenido */}
          <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Mejora tu experiencia!
            </h2>
            <p className="text-gray-600">
              Regístrate para desbloquear todas las funcionalidades
            </p>
          </div>

          {/* Beneficios */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3 text-left">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaChartLine className="text-blue-600" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Seguimiento de Progreso</h3>
                <p className="text-sm text-gray-600">Ve tu evolución en tiempo real</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left">
              <div className="bg-green-100 p-2 rounded-full">
                <FaHistory className="text-green-600" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Historial Completo</h3>
                <p className="text-sm text-gray-600">Revisa todas tus prácticas anteriores</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-left">
              <div className="bg-yellow-100 p-2 rounded-full">
                <FaTrophy className="text-yellow-600" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Logros y Estadísticas</h3>
                <p className="text-sm text-gray-600">Desbloquea badges y métricas avanzadas</p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Registrarme con Google
            </button>
            <button
              onClick={handleSkip}
              className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Continuar sin registro
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Puedes registrarte en cualquier momento desde el menú
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
