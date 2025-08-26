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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </button>

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
  );
}
