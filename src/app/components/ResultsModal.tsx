'use client';

import { FaTrophy, FaClock, FaKeyboard, FaTimes } from 'react-icons/fa';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    wpm: number;
    correctWords: number;
    totalWords: number;
    accuracy: number;
    timeElapsed: number;
  };
  testInfo?: {
    minutos: number;
    minimo_palabras: number;
    nombre: string;
  };
}

export default function ResultsModal({ isOpen, onClose, results, testInfo }: ResultsModalProps) {
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Función para calcular el color de la barra de progreso
  const getProgressBarColor = () => {
    if (!testInfo) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    
    const progressPercentage = (results.correctWords / testInfo.minimo_palabras) * 100;
    
    if (progressPercentage <= 100) {
      // De 0% a 100%: Rojo → Amarillo (progresivo)
      if (progressPercentage <= 25) {
        // De 0% a 25%: Rojo intenso
        return 'bg-gradient-to-r from-red-600 to-red-500';
      } else if (progressPercentage <= 50) {
        // De 25% a 50%: Rojo → Naranja
        return 'bg-gradient-to-r from-red-500 to-orange-500';
      } else if (progressPercentage <= 75) {
        // De 50% a 75%: Naranja → Amarillo claro
        return 'bg-gradient-to-r from-orange-500 to-yellow-500';
      } else {
        // De 75% a 100%: Amarillo claro → Amarillo brillante
        return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
      }
    } else {
      // Más del 100%: Verde cada vez más brillante
      if (progressPercentage <= 125) {
        // De 100% a 125%: Verde claro
        return 'bg-gradient-to-r from-green-400 to-green-500';
      } else if (progressPercentage <= 150) {
        // De 125% a 150%: Verde medio
        return 'bg-gradient-to-r from-green-500 to-green-600';
      } else if (progressPercentage <= 200) {
        // De 150% a 200%: Verde brillante
        return 'bg-gradient-to-r from-green-600 to-green-700';
      } else {
        // Más del 200%: Verde muy brillante
        return 'bg-gradient-to-r from-green-700 to-green-800';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal con borde y sombra */}
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
            <span className="text-sm font-semibold text-orange-200">Práctica Completada</span>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white hover:text-orange-300 transition-colors">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-500 rounded-full mb-4 shadow-lg">
              <FaTrophy className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Práctica Completada!
            </h2>
            <p className="text-gray-600">
              Aquí están tus resultados
            </p>
          </div>

        {/* Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WPM */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaKeyboard className="text-green-600 mr-2" size={16} />
                <p className="text-sm text-green-600 font-medium">Velocidad</p>
              </div>
              <p className="text-2xl font-bold text-green-800">{results.wpm} WPM</p>
              <p className="text-xs text-green-600 mt-1">Palabras por minuto</p>
            </div>
          </div>

          {/* Precisión */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="text-center">
              <p className="text-sm text-orange-600 font-medium mb-2">Precisión</p>
              <p className="text-2xl font-bold text-orange-800">{results.accuracy}%</p>
              <p className="text-xs text-orange-600 mt-1">
                {results.correctWords} de {results.totalWords} palabras
              </p>
            </div>
          </div>

          {/* Tiempo */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FaClock className="text-gray-600 mr-2" size={16} />
                <p className="text-sm text-gray-600 font-medium">Tiempo</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatTime(results.timeElapsed)}
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico de Progreso vs Objetivo */}
        {testInfo && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              Progreso vs Objetivo
            </h3>
            
            {/* Información del objetivo */}
            <div className="text-center mb-4">
              <p className="text-sm text-gray-700 mb-1">
                <strong>Objetivo:</strong> {testInfo.minimo_palabras} palabras en {testInfo.minutos} minuto{testInfo.minutos > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Tu resultado:</strong> {results.correctWords} palabras en {formatTime(results.timeElapsed)}
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>0</span>
                <span>{testInfo.minimo_palabras} (objetivo)</span>
                <span>{Math.max(testInfo.minimo_palabras, results.correctWords)}</span>
              </div>
              
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                {/* Barra de progreso del usuario */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${getProgressBarColor()}`}
                  style={{ 
                    width: `${Math.min((results.correctWords / testInfo.minimo_palabras) * 100, 100)}%` 
                  }}
                />
                
                {/* Línea del objetivo */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-800 border-l-2 border-dashed"
                  style={{ left: `${(testInfo.minimo_palabras / Math.max(testInfo.minimo_palabras, results.correctWords)) * 100}%` }}
                />
              </div>
            </div>

            {/* Mensaje de resultado */}
            <div className="text-center">
              {results.correctWords >= testInfo.minimo_palabras ? (
                <div className="flex items-center justify-center text-green-700">
                  <FaTrophy className="mr-2" />
                  <span className="font-semibold">
                    {results.correctWords >= testInfo.minimo_palabras * 1.5 
                      ? '¡Excelente! Has superado ampliamente el objetivo' 
                      : '¡Aprobado! Has superado el objetivo'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-orange-700">
                  <span className="font-semibold">
                    Te faltan {testInfo.minimo_palabras - results.correctWords} palabras para aprobar
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg font-bold hover:from-green-500 hover:to-green-400 transition-all duration-200 shadow-md"
          >
            Continuar Practicando
          </button>
          
          {/* Botón comentado hasta que se implemente la funcionalidad
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:from-gray-400 hover:to-gray-500 transition-all duration-200 shadow-md"
          >
            Ver Estadísticas
          </button>
          */}
        </div>
        </div>
      </div>
    </div>
  );
}
