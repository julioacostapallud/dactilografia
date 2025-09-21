"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import React from "react";
import { FaRegClock, FaRandom } from "react-icons/fa";
import Header from './components/Header';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';
import ResultsModal from './components/ResultsModal';
import MarkedText from './components/MarkedText';
import PracticeTypeModal from './components/PracticeTypeModal';
import AuthModal from './components/AuthModal';

import { apiService, Prueba } from '@/lib/api';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePageVisit } from '@/lib/hooks/usePageVisit';
import AdSenseAd from './components/AdSenseAd';

const DEFAULT_DURATION_SECONDS = 4 * 60; // 4 minutos por defecto

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  usePageVisit('/');
  const [inputText, setInputText] = useState("");
  const [practiceText, setPracticeText] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(DEFAULT_DURATION_SECONDS);
  const [timer, setTimer] = useState(DEFAULT_DURATION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [currentPrueba, setCurrentPrueba] = useState<Prueba | null>(null);
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showPracticeTypeModal, setShowPracticeTypeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [practiceResults, setPracticeResults] = useState({
    wpm: 0,
    correctWords: 0,
    totalWords: 0,
    accuracy: 0,
    timeElapsed: 0
  });
  const [currentTestInfo, setCurrentTestInfo] = useState<{
    minutos: number;
    minimo_palabras: number;
    nombre: string;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Función para cargar un texto aleatorio desde la API (deploy trigger v2)
  const loadRandomText = useCallback(async () => {
    if (isLocked) return; // No cambiar texto durante la práctica
    
    // No cargar texto si no hay prueba seleccionada
    if (!currentPrueba && !currentTestInfo) {
      setPracticeText("");
      return;
    }
    
    console.log('🔄 Cargando texto aleatorio...', { currentPrueba: currentPrueba?.nombre });
    setIsLoadingText(true);
    try {
      if (currentPrueba) {
        // Si hay una prueba seleccionada, cargar texto de esa prueba
        console.log('📝 Cargando texto para prueba:', currentPrueba.nombre);
        const textoPrueba = await apiService.getTextoPruebaAleatorio(currentPrueba.id);
        if (textoPrueba) {
          console.log('✅ Texto cargado exitosamente');
          setPracticeText(textoPrueba.texto.trim());
        } else {
          console.error('❌ No se encontraron textos para esta prueba');
          setPracticeText("No hay textos disponibles para esta prueba. Selecciona otra práctica.");
        }
      } else if (currentTestInfo) {
        // Si hay práctica personalizada, usar el texto ya establecido
        console.log('📝 Usando texto de práctica personalizada');
        // El texto ya está establecido por handleCustomPractice
      } else {
        // No debería llegar aquí, pero por seguridad
        setPracticeText("");
      }
    } catch (error) {
      console.error('❌ Error cargando texto:', error);
      setPracticeText("Error al cargar el texto. Intenta seleccionar otra práctica.");
    } finally {
      setIsLoadingText(false);
    }
  }, [isLocked, currentPrueba, currentTestInfo]);

  // Funciones para cargar pruebas

  // Las instituciones y pruebas se cargan desde el modal de práctica

  // Cargar texto aleatorio al montar el componente solo si hay prueba seleccionada
  useEffect(() => {
    if (currentPrueba || currentTestInfo) {
      loadRandomText();
    }
  }, [loadRandomText, currentPrueba, currentTestInfo]);

  // Cargar texto cuando se selecciona una prueba
  useEffect(() => {
    if (currentPrueba) {
      console.log('🔄 useEffect: currentPrueba cambió, cargando texto...');
      loadRandomText();
    } else if (!currentTestInfo) {
      // Limpiar texto cuando no hay prueba seleccionada
      setPracticeText("");
    }
  }, [currentPrueba, currentTestInfo, loadRandomText]);





  // Mostrar onboarding si el usuario no está autenticado y es su primera visita
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        // Mostrar onboarding después de 1 segundo
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated]);

  // Iniciar la práctica
  const startPractice = () => {
    if (!practiceText.trim()) return;
    setIsLocked(true);
    setIsRunning(true);
    setInputText("");
    setTimer(durationSeconds);
    setWpm(0);
    setCorrectWords(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // Espera breve para asegurar el render
  };

  // Función para el demo automático
  const startDemo = () => {
    if (!practiceText.trim() || isDemoRunning) return;
    
    setIsDemoRunning(true);
    setIsLocked(true);
    setIsRunning(true);
    setInputText("");
    setTimer(durationSeconds);
    setWpm(0);
    setCorrectWords(0);
    
    const words = practiceText.trim().split(/\s+/);
    let currentWordIndex = 0;
    
    demoIntervalRef.current = setInterval(() => {
      if (currentWordIndex >= words.length) {
        // Demo terminado
        clearInterval(demoIntervalRef.current!);
        setIsDemoRunning(false);
        return;
      }
      
      const currentWord = words[currentWordIndex];
      setInputText(prev => prev + (prev ? ' ' : '') + currentWord);
      currentWordIndex++;
      
    }, 200); // 200ms entre palabras (simula tipeo rápido)
  };

  const stopDemo = () => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    setIsDemoRunning(false);
  };

  // Cleanup del demo cuando se cancela o finaliza la práctica
  const cleanupDemo = () => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    setIsDemoRunning(false);
  };

  // Cancelar la práctica
  const cancelPractice = () => {
    cleanupDemo();
    setIsLocked(false);
    setIsRunning(false);
    setInputText("");
    setTimer(durationSeconds);
    setWpm(0);
    setCorrectWords(0);
  };

  // Finalizar la práctica
  const finishPractice = useCallback(() => {
    console.log('🔴 finishPractice llamada');
    cleanupDemo();
    setIsLocked(false);
    setIsRunning(false);
    
    // Calcular resultados finales
    const totalWords = practiceText.trim().split(/\s+/).length;
    const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
    const timeElapsed = durationSeconds - timer;
    
    console.log('📊 Resultados calculados:', {
      wpm,
      correctWords,
      totalWords,
      accuracy,
      timeElapsed
    });
    
    // Guardar resultados
    setPracticeResults({
      wpm,
      correctWords,
      totalWords,
      accuracy,
      timeElapsed
    });
    
    // Mostrar modal de resultados
    console.log('🎯 Mostrando modal de resultados');
    setShowResults(true);
    
    // Si el usuario no está autenticado, mostrar onboarding después de la práctica
    if (!isAuthenticated && typeof window !== 'undefined') {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
      }
    }
  }, [isAuthenticated, wpm, correctWords, timer, durationSeconds, practiceText]);

  // Temporizador
  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && isRunning) {
      finishPractice();
    }
    return () => clearTimeout(intervalRef.current!);
  }, [isRunning, timer, finishPractice]);



  // Calcular correctas con la nueva lógica
  useEffect(() => {
    if (!isRunning) return;
    
    const inputWords = inputText.trim().split(/\s+/);
    const targetWords = practiceText.trim().split(/\s+/);
    let correctCount = 0;
    
    for (let i = 0; i < inputWords.length && i < targetWords.length; i++) {
      if (inputWords[i] === targetWords[i]) {
        correctCount++;
      }
    }
    
    setCorrectWords(correctCount);
    const minutes = (durationSeconds - timer) / 60;
    setWpm(minutes > 0 ? Math.round(inputWords.length / minutes) : 0);
  }, [inputText, isRunning, timer, practiceText, durationSeconds]);







  // Formatear tiempo mm:ss
  const formatTime = (s: number) => {
    if (!currentPrueba && !currentTestInfo) return "--:--";
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };



  // Funciones para el onboarding
  const handleOnboardingRegister = () => {
    setShowOnboarding(false);
    // Abrir modal de autenticación en modo registro
    setShowAuthModal(true);
    setAuthMode('register');
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  // Funciones para la selección de práctica
  const handleSelectPractice = (prueba: Prueba) => {
    console.log('🎯 Prueba seleccionada:', prueba.nombre);
    setCurrentPrueba(prueba);
    // Limpiar ejercicio anterior
    // Limpiar texto anterior
    setPracticeText(""); // Limpiar texto actual
    setDurationSeconds(prueba.minutos * 60); // Actualizar duración
    setTimer(prueba.minutos * 60); // Actualizar timer según la prueba
    
    // Guardar información de la prueba para el modal
    setCurrentTestInfo({
      minutos: prueba.minutos,
      minimo_palabras: prueba.minimo_palabras,
      nombre: prueba.nombre
    });
  };

  // Función para manejar práctica personalizada
  const handleCustomPractice = (config: {
    texto: string;
    objetivoPalabras: number;
    minutos: number;
  }) => {
    console.log('🎯 Práctica personalizada configurada:', config);
    setCurrentPrueba(null); // Limpiar prueba seleccionada
    setPracticeText(config.texto);
    setDurationSeconds(config.minutos * 60);
    setTimer(config.minutos * 60);
    
    // Guardar información de la práctica personalizada para el modal
    setCurrentTestInfo({
      minutos: config.minutos,
      minimo_palabras: config.objetivoPalabras,
      nombre: 'Práctica Personalizada'
    });
  };

  // Las funciones de cambio se manejan en el modal de práctica

  return (
    <div className="min-h-screen flex flex-col text-black">
      <Header />
      
      {/* Modal de Onboarding */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        onRegister={handleOnboardingRegister}
      />

      {/* Modal de Autenticación */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setAuthMode={setAuthMode}
      />
      

      
      {/* Contenido principal */}
      <div className="flex flex-col items-center p-2 pt-4 bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-green-100/30 flex-1 w-full">
        

      {/* Controles organizados en 2 columnas */}
      <div className="flex w-full max-w-5xl gap-4 mb-4">
        {/* Columna IZQUIERDA */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Controles superiores - Columna izquierda */}
          <div className="flex justify-between items-center h-12">
            {/* Botón Seleccionar Prueba - START */}
            <button
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 disabled:from-green-300 disabled:to-green-400 disabled:opacity-50 text-sm font-bold transition-all duration-200 shadow-md disabled:shadow-none"
              onClick={() => setShowPracticeTypeModal(true)}
              disabled={isLocked}
            >
              Seleccionar Prueba
            </button>

            {/* Botón Otro Texto - END */}
            <button
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 disabled:from-orange-300 disabled:to-orange-400 disabled:opacity-50 flex items-center gap-1 text-sm font-medium transition-all duration-200 shadow-md disabled:shadow-none"
              onClick={loadRandomText}
              disabled={isLocked || isLoadingText || (!currentPrueba && !currentTestInfo)}
            >
              <FaRandom className="text-xs" />
              {isLoadingText ? 'Cargando...' : 'Otro texto'}
            </button>
          </div>
        </div>

        {/* Columna DERECHA */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Controles superiores - Columna derecha */}
          <div className="flex justify-between items-center h-12">
            {/* Botones de control - START */}
            <div className="flex gap-3 items-center">
              <button
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 disabled:from-green-300 disabled:to-green-400 disabled:opacity-50 text-sm font-bold transition-all duration-200 shadow-md disabled:shadow-none"
                onClick={startPractice}
                disabled={isLocked || !practiceText.trim() || (!currentPrueba && !currentTestInfo)}
              >
                Iniciar
              </button>
              {user?.email === 'julioacostapallud@gmail.com' && (
                <button
                  className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-400 hover:to-orange-500 disabled:from-orange-300 disabled:to-orange-400 disabled:opacity-50 text-sm font-medium transition-all duration-200 shadow-md disabled:shadow-none"
                  onClick={isDemoRunning ? stopDemo : startDemo}
                  disabled={!practiceText.trim() || (isLocked && !isDemoRunning) || (!currentPrueba && !currentTestInfo)}
                >
                  {isDemoRunning ? 'Detener Demo' : 'Demo'}
                </button>
              )}
              <button
                className="px-3 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-400 hover:to-gray-500 disabled:from-gray-300 disabled:to-gray-400 disabled:opacity-50 text-sm font-medium transition-all duration-200 shadow-md disabled:shadow-none"
                onClick={cancelPractice}
                disabled={!isLocked}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 disabled:from-green-300 disabled:to-green-400 disabled:opacity-50 text-sm font-bold transition-all duration-200 shadow-md disabled:shadow-none"
                onClick={finishPractice}
                disabled={!isLocked}
              >
                Finalizar
              </button>
            </div>

            {/* Métricas - END */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-gray-700 text-sm font-medium">WPM</span>
                <span className="font-mono text-2xl bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent font-bold">{wpm}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-gray-700 text-sm font-medium">Tiempo</span>
                <span className="flex items-center gap-1 font-mono text-2xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-bold">
                  <FaRegClock className="text-orange-500 text-xl" /> {formatTime(timer)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full h-[75vh] gap-4 justify-center px-4">
        {/* Sector de publicidad izquierdo - Solo mostrar si hay contenido */}
        {practiceText.trim() && (currentPrueba || currentTestInfo) ? (
          <div className="w-64 bg-gray-100 border rounded flex items-center justify-center h-[75vh] flex-shrink-0">
            <div className="text-center text-gray-500">
              <div className="text-lg font-semibold mb-2">Publicidad</div>
              <div className="text-sm">Google Ads</div>
              {/* AdSense Ad Unit - Left Sidebar */}
              <AdSenseAd adSlot="9852913988" />
            </div>
          </div>
        ) : (
          <div className="w-64 flex-shrink-0"></div>
        )}
        
        {/* Contenido principal */}
        <div className="flex gap-4 max-w-5xl flex-1">
          {/* Lado izquierdo: texto a copiar */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-gray-800">Texto a Copiar:</label>
              {isLocked && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Progreso:</span>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 ease-out"
                      style={{ 
                        width: `${Math.min((correctWords / Math.max(practiceText.trim().split(/\s+/).length, 1)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <span className="font-mono">{correctWords}/{practiceText.trim().split(/\s+/).length}</span>
                </div>
              )}
            </div>
            {isLocked ? (
              <MarkedText 
                text={practiceText}
                inputText={inputText}
                isRunning={isRunning}
              />
            ) : (
              <div 
                className={`w-full h-full p-3 border-2 border-gray-200 rounded-lg text-sm leading-tight overflow-y-auto select-none ${
                  !currentPrueba && !currentTestInfo 
                    ? 'bg-gray-100' 
                    : 'bg-white text-black'
                }`}
                style={{ 
                  fontSize: '0.875rem', 
                  lineHeight: '1.25rem'
                }}
              >
                {isLoadingText ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                    Cargando texto...
                  </div>
                ) : practiceText ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {practiceText}
                  </div>
                ) : !currentPrueba && !currentTestInfo ? (
                  <div className="text-gray-600">
                    <div className="mb-4 text-lg font-semibold text-gray-800">
                      🎯 ¡Bienvenido a DACTILO!
                    </div>
                    <div className="space-y-3 text-sm">
                      <p>• <strong>Mejora tu velocidad de tipeo</strong> con textos legales reales</p>
                      <p>• <strong>Mide tu progreso</strong> con métricas de WPM (palabras por minuto)</p>
                      <p>• <strong>Practica con diferentes instituciones</strong> y tipos de documentos</p>
                      <p>• <strong>Interfaz moderna</strong> optimizada para PC y notebooks</p>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-800 font-medium">
                        👆 Haz clic en <strong>&quot;Seleccionar Prueba&quot;</strong> para comenzar tu primera sesión de práctica
                      </p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    Usa &apos;Otro texto&apos; para cambiar el fragmento...
                  </span>
                )}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span className="font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Palabras en el texto: <span className="font-mono text-lg">{practiceText.trim() ? practiceText.trim().split(/\s+/).length : 0}</span></span>
              <span className="text-xs text-gray-500 italic">Los saltos de línea se eliminan para mejorar el conteo</span>
            </div>
          </div>
          {/* Lado derecho: input de tipeo */}
          <div className="flex-1 flex flex-col">
            <label className="font-bold text-gray-800 mb-2">Tipea aquí:</label>
            <textarea
              ref={inputRef}
              className={`w-full h-full p-3 border-2 border-gray-200 rounded-lg resize-none text-sm leading-tight ${
                !currentPrueba && !currentTestInfo 
                  ? 'bg-gray-100' 
                  : 'bg-white text-black'
              } disabled:bg-gray-100`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={e => e.preventDefault()}
              disabled={!isLocked || !isRunning || (!currentPrueba && !currentTestInfo)}
              placeholder={
                !currentPrueba && !currentTestInfo 
                  ? "Seleccione una prueba para comenzar a practicar" 
                  : isLocked 
                    ? "Empieza a tipear..." 
                    : "Inicia la práctica para comenzar"
              }
              style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}
            />
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span className="font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Palabras correctas: <span className="font-mono text-lg">{correctWords}</span></span>
              <span className="text-xs text-gray-500 italic">Solo palabras completas</span>
            </div>
          </div>
        </div>
        
        {/* Sector de publicidad derecho - Solo mostrar si hay contenido */}
        {practiceText.trim() && (currentPrueba || currentTestInfo) ? (
          <div className="w-64 bg-gray-100 border rounded flex items-center justify-center h-[75vh] flex-shrink-0">
            <div className="text-center text-gray-500">
              <div className="text-lg font-semibold mb-2">Publicidad</div>
              <div className="text-sm">Google Ads</div>
              {/* AdSense Ad Unit - Right Sidebar */}
              <AdSenseAd adSlot="8179055454" />
            </div>
          </div>
        ) : (
          <div className="w-64 flex-shrink-0"></div>
        )}
      </div>
      </div>
      
      {/* Modal de Resultados */}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={practiceResults}
        testInfo={currentTestInfo || undefined}
      />

      {/* Modal de Tipo de Práctica */}
      <PracticeTypeModal
        isOpen={showPracticeTypeModal}
        onClose={() => setShowPracticeTypeModal(false)}
        onSelectPractice={handleSelectPractice}
        onCustomPractice={handleCustomPractice}
      />
      
      <Footer />
    </div>
  );
}
