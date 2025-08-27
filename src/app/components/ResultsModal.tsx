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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay sutil con blur */}
      <div 
        className="absolute inset-0 bg-white/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal con borde y sombra */}
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-blue-200 max-w-md w-full p-6 animate-in slide-in-from-bottom-4 duration-300">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
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
        <div className="space-y-4">
          {/* WPM */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaKeyboard className="text-blue-600 mr-3" size={20} />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Velocidad</p>
                  <p className="text-2xl font-bold text-blue-800">{results.wpm} WPM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Palabras por minuto</p>
              </div>
            </div>
          </div>

          {/* Precisión */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Precisión</p>
                <p className="text-2xl font-bold text-green-800">{results.accuracy}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">
                  {results.correctWords} de {results.totalWords} palabras
                </p>
              </div>
            </div>
          </div>

          {/* Tiempo */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaClock className="text-purple-600 mr-3" size={20} />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Tiempo</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {formatTime(results.timeElapsed)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Progreso vs Objetivo */}
        {testInfo && (
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-3 text-center">
              Progreso vs Objetivo
            </h3>
            
            {/* Información del objetivo */}
            <div className="text-center mb-4">
              <p className="text-sm text-indigo-600 mb-1">
                <strong>Objetivo:</strong> {testInfo.minimo_palabras} palabras en {testInfo.minutos} minuto{testInfo.minutos > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-indigo-600">
                <strong>Tu resultado:</strong> {results.correctWords} palabras en {formatTime(results.timeElapsed)}
              </p>
            </div>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-indigo-600 mb-1">
                <span>0</span>
                <span>{testInfo.minimo_palabras} (objetivo)</span>
                <span>{Math.max(testInfo.minimo_palabras, results.correctWords)}</span>
              </div>
              
              <div className="relative h-6 bg-indigo-100 rounded-full overflow-hidden">
                {/* Barra de progreso del usuario */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${
                    results.correctWords >= testInfo.minimo_palabras 
                      ? 'bg-gradient-to-r from-green-400 to-green-600' 
                      : 'bg-gradient-to-r from-orange-400 to-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min((results.correctWords / testInfo.minimo_palabras) * 100, 100)}%` 
                  }}
                />
                
                {/* Línea del objetivo */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-indigo-800 border-l-2 border-dashed"
                  style={{ left: `${(testInfo.minimo_palabras / Math.max(testInfo.minimo_palabras, results.correctWords)) * 100}%` }}
                />
              </div>
            </div>

            {/* Mensaje de resultado */}
            <div className="text-center">
              {results.correctWords >= testInfo.minimo_palabras ? (
                <div className="flex items-center justify-center text-green-700">
                  <FaTrophy className="mr-2" />
                  <span className="font-semibold">¡Aprobado! Has superado el objetivo</span>
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
        <div className="mt-6 space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
          >
            Continuar Practicando
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Ver Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
}
