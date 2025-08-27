"use client";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { FaRegClock, FaRandom } from "react-icons/fa";
import Header from './components/Header';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';
import ResultsModal from './components/ResultsModal';
import MarkedText from './components/MarkedText';

import { apiService, Prueba, Institucion } from '@/lib/api';
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
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [selectedInstitucionId, setSelectedInstitucionId] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Función para cargar un texto aleatorio desde la API (deploy trigger v2)
  const loadRandomText = async () => {
    if (isLocked) return; // No cambiar texto durante la práctica
    
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
      } else {
        // Fallback al sistema anterior
        console.log('📝 Cargando texto genérico');
        const ejercicio = await apiService.getEjercicioAleatorio();
        if (ejercicio) {
          console.log('✅ Texto genérico cargado');
          setPracticeText(ejercicio.texto.trim());
        } else {
          console.error('❌ No se encontraron ejercicios disponibles');
          setPracticeText("La práctica hace al maestro. Cada día que practicas, mejoras un poco más.");
        }
      }
    } catch (error) {
      console.error('❌ Error cargando texto:', error);
      setPracticeText("Error al cargar el texto. Intenta seleccionar otra práctica.");
    } finally {
      setIsLoadingText(false);
    }
  };

  // Cargar instituciones al montar el componente
  useEffect(() => {
    loadInstituciones();
  }, []);

  // Cargar pruebas cuando se selecciona una institución
  useEffect(() => {
    if (selectedInstitucionId) {
      loadPruebas(selectedInstitucionId);
    } else {
      setPruebas([]);
    }
  }, [selectedInstitucionId]);

  // Cargar texto aleatorio al montar el componente
  useEffect(() => {
    loadRandomText();
  }, []);

  // Cargar texto cuando se selecciona una prueba
  useEffect(() => {
    if (currentPrueba) {
      console.log('🔄 useEffect: currentPrueba cambió, cargando texto...');
      loadRandomText();
    }
  }, [currentPrueba]);





  // Mostrar onboarding si el usuario no está autenticado y es su primera visita
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        // Mostrar onboarding después de 5 segundos (menos intrusivo)
        const timer = setTimeout(() => {
          setShowOnboarding(true);
        }, 5000);
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
  const finishPractice = () => {
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
  };

  // Temporizador
  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && isRunning) {
      finishPractice();
    }
    return () => clearTimeout(intervalRef.current!);
  }, [isRunning, timer]);



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
  }, [inputText, isRunning, timer, practiceText]);







  // Formatear tiempo mm:ss
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;



  // Funciones para el onboarding
  const handleOnboardingRegister = () => {
    setShowOnboarding(false);
    // Redirigir a la página de login
    window.location.href = '/login';
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



  // Funciones para cargar instituciones y pruebas
  const loadInstituciones = async () => {
    try {
      const data = await apiService.getInstituciones();
      setInstituciones(data);
    } catch (error) {
      console.error('Error cargando instituciones:', error);
    }
  };

  const loadPruebas = async (institucionId: number) => {
    try {
      const data = await apiService.getPruebas(institucionId);
      setPruebas(data);
    } catch (error) {
      console.error('Error cargando pruebas:', error);
    }
  };

  const handleInstitucionChange = (institucionId: number) => {
    setSelectedInstitucionId(institucionId);
    setCurrentPrueba(null); // Limpiar prueba seleccionada
  };

  const handlePruebaChange = (pruebaId: number) => {
    const prueba = pruebas.find(p => p.id === pruebaId);
    if (prueba) {
      handleSelectPractice(prueba);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-black">
      <Header />
      
      {/* Modal de Onboarding */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        onRegister={handleOnboardingRegister}
      />
      

      
      {/* Contenido principal */}
      <div className="flex flex-col items-center p-2 pt-4 bg-gradient-to-br from-blue-50/50 via-blue-100/30 to-green-100/30 flex-1 w-full">
        

      {/* Controles y selectores en una sola fila */}
      <div className="flex w-full max-w-5xl gap-4 mb-4 items-center">
        {/* Selectores de práctica */}
        <div className="flex gap-3 flex-1">
          <select
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={selectedInstitucionId || ''}
            onChange={(e) => handleInstitucionChange(Number(e.target.value))}
            disabled={isLocked}
          >
            <option value="">Institución</option>
            {instituciones.map((institucion) => (
              <option key={institucion.id} value={institucion.id}>
                {institucion.nombre} - {institucion.provincia}
              </option>
            ))}
          </select>
          
          <select
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={currentPrueba?.id || ''}
            onChange={(e) => handlePruebaChange(Number(e.target.value))}
            disabled={!selectedInstitucionId || isLocked}
          >
            <option value="">Prueba</option>
            {pruebas.map((prueba) => (
              <option key={prueba.id} value={prueba.id}>
                {prueba.nombre} ({prueba.minutos}min)
              </option>
            ))}
          </select>
        </div>

        {/* Botones de control */}
        <div className="flex gap-3 items-center">
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 text-sm"
            onClick={startPractice}
            disabled={isLocked || !practiceText.trim()}
          >
            Iniciar
          </button>
          {user?.email === 'julioacostapallud@gmail.com' && (
            <button
              className="px-3 py-2 bg-green-600 text-white rounded disabled:bg-gray-400 text-sm"
              onClick={isDemoRunning ? stopDemo : startDemo}
              disabled={!practiceText.trim() || (isLocked && !isDemoRunning)}
            >
              {isDemoRunning ? 'Detener Demo' : 'Demo'}
            </button>
          )}
          <button
            className="px-3 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300 text-sm"
            onClick={cancelPractice}
            disabled={!isLocked}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-2 bg-green-600 text-white rounded disabled:bg-gray-400 text-sm"
            onClick={finishPractice}
            disabled={!isLocked}
          >
            Finalizar
          </button>
          <button
            className="px-3 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400 flex items-center gap-1 text-sm"
            onClick={loadRandomText}
            disabled={isLocked || isLoadingText}
          >
            <FaRandom className="text-xs" />
            {isLoadingText ? 'Cargando...' : 'Nuevo'}
          </button>
        </div>

        {/* Métricas */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-black text-sm font-normal">WPM</span>
            <span className="font-mono text-2xl text-blue-600 font-bold">{wpm}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-black text-sm font-normal">Tiempo</span>
            <span className="flex items-center gap-1 font-mono text-2xl text-red-600 font-bold">
              <FaRegClock className="text-red-500 text-xl" /> {formatTime(timer)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex w-full h-[75vh] gap-4 justify-center px-4">
        {/* Sector de publicidad izquierdo */}
        <div className="w-64 bg-gray-100 border rounded flex items-center justify-center h-[75vh] flex-shrink-0">
          <div className="text-center text-gray-500">
            <div className="text-lg font-semibold mb-2">Publicidad</div>
            <div className="text-sm">Google Ads</div>
            {/* AdSense Ad Unit - Left Sidebar */}
            <AdSenseAd adSlot="9852913988" />
          </div>
        </div>
        
        {/* Contenido principal */}
        <div className="flex gap-4 max-w-5xl flex-1">
          {/* Lado izquierdo: texto a tipear */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold">Texto para practicar:</label>
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
                className="w-full h-full p-3 border rounded bg-white text-black text-sm leading-tight overflow-y-auto select-none"
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
                    {console.log('📏 Longitud del texto:', practiceText.length, 'líneas:', practiceText.split('\n').length)}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">
                    Usa 'Nuevo Texto' para cambiar el fragmento...
                  </span>
                )}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span className="font-semibold text-blue-600">Palabras en el texto: <span className="font-mono text-lg">{practiceText.trim() ? practiceText.trim().split(/\s+/).length : 0}</span></span>
              <span className="text-xs text-gray-500 italic">Los saltos de línea se eliminan para mejorar el conteo</span>
            </div>
          </div>
          {/* Lado derecho: input de tipeo */}
          <div className="flex-1 flex flex-col">
            <label className="font-semibold mb-2">Tipea aquí:</label>
            <textarea
              ref={inputRef}
              className="w-full h-full p-3 border rounded resize-none text-sm leading-tight bg-white text-black disabled:bg-gray-100"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={e => e.preventDefault()}
              disabled={!isLocked || !isRunning}
              placeholder={isLocked ? "Empieza a tipear..." : "Inicia la práctica para comenzar"}
              style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}
            />
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span className="font-semibold text-green-600">Palabras correctas: <span className="font-mono text-lg">{correctWords}</span></span>
              <span className="text-xs text-gray-500 italic">Solo palabras completas</span>
            </div>
          </div>
        </div>
        
        {/* Sector de publicidad derecho */}
        <div className="w-64 bg-gray-100 border rounded flex items-center justify-center h-[75vh] flex-shrink-0">
          <div className="text-center text-gray-500">
            <div className="text-lg font-semibold mb-2">Publicidad</div>
            <div className="text-sm">Google Ads</div>
            {/* AdSense Ad Unit - Right Sidebar */}
            <AdSenseAd adSlot="8179055454" />
          </div>
        </div>
      </div>
      </div>
      
      {/* Modal de Resultados */}
      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={practiceResults}
        testInfo={currentTestInfo || undefined}
      />
      
      <Footer />
    </div>
  );
}
