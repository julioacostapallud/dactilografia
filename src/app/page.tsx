"use client";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { FaRegClock, FaRandom } from "react-icons/fa";
import Header from './components/Header';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';

import { apiService, Prueba, Institucion } from '@/lib/api';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePageVisit } from '@/lib/hooks/usePageVisit';
import AdSenseAd from './components/AdSenseAd';

const DEFAULT_DURATION_SECONDS = 4 * 60; // 4 minutos por defecto

export default function Home() {
  const { isAuthenticated } = useAuth();
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  // Función para cargar un texto aleatorio desde la API (deploy trigger v2)
  const loadRandomText = async () => {
    if (isLocked) return; // No cambiar texto durante la práctica
    
    setIsLoadingText(true);
    try {
      if (currentPrueba) {
        // Si hay una prueba seleccionada, cargar texto de esa prueba
        const textoPrueba = await apiService.getTextoPruebaAleatorio(currentPrueba.id);
        if (textoPrueba) {
          setPracticeText(textoPrueba.texto.trim());
        } else {
          console.error('No se encontraron textos para esta prueba');
          setPracticeText("No hay textos disponibles para esta prueba. Selecciona otra práctica.");
        }
      } else {
        // Fallback al sistema anterior
        const ejercicio = await apiService.getEjercicioAleatorio();
        if (ejercicio) {
          setPracticeText(ejercicio.texto.trim());
        } else {
          console.error('No se encontraron ejercicios disponibles');
          setPracticeText("La práctica hace al maestro. Cada día que practicas, mejoras un poco más.");
        }
      }
    } catch (error) {
      console.error('Error cargando texto:', error);
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

  // Cancelar la práctica
  const cancelPractice = () => {
    setIsLocked(false);
    setIsRunning(false);
    setInputText("");
    setTimer(durationSeconds);
    setWpm(0);
    setCorrectWords(0);
  };

  // Finalizar la práctica
  const finishPractice = () => {
    setIsLocked(false);
    setIsRunning(false);
    
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

  // Algoritmo de comparación mejorado para errores de omisión/adición
  function getWordStates() {
    const inputWords = inputText.trim().split(/\s+/);
    const targetWords = practiceText.trim().split(/\s+/);
    const states: { word: string; status: "correct" | "error" | "pending" | "current" }[] = [];
    let i = 0, j = 0;
    while (i < targetWords.length) {
      const target = targetWords[i];
      const input = inputWords[j] ?? "";
      if (!input) {
        states.push({ word: target, status: "pending" });
        i++;
        continue;
      }
      if (i === j) {
        // Palabra actual
        if (j === inputWords.length - 1 && input !== target) {
          states.push({ word: target, status: "current" });
        } else if (input === target) {
          states.push({ word: target, status: "correct" });
        } else {
          states.push({ word: target, status: "error" });
        }
        i++;
        j++;
      } else if (input === target) {
        states.push({ word: target, status: "correct" });
        i++;
        j++;
      } else if (targetWords[i + 1] === input) {
        // Palabra omitida en input
        states.push({ word: target, status: "error" });
        i++;
      } else if (inputWords[j + 1] === target) {
        // Palabra extra en input
        j++;
      } else {
        // Error general
        if (j === inputWords.length - 1) {
          states.push({ word: target, status: "current" });
        } else {
          states.push({ word: target, status: "error" });
        }
        i++;
        j++;
      }
    }
    return states;
  }

  // Calcular correctas con la nueva lógica
  useEffect(() => {
    if (!isRunning) return;
    const states = getWordStates();
    setCorrectWords(states.filter((s) => s.status === "correct").length);
    const inputWords = inputText.trim().split(/\s+/);
    const minutes = (durationSeconds - timer) / 60;
    setWpm(minutes > 0 ? Math.round(inputWords.length / minutes) : 0);
  }, [inputText, isRunning, timer, practiceText]);

  // Auto-scroll para seguir el progreso del texto
  useEffect(() => {
    if (!isRunning || !textContainerRef.current) return;
    
    const states = getWordStates();
    const currentWordIndex = states.findIndex(s => s.status === "current");
    
    if (currentWordIndex === -1) return;
    
    const container = textContainerRef.current;
    const wordElements = container.querySelectorAll('span');
    
    if (wordElements[currentWordIndex]) {
      const currentWordElement = wordElements[currentWordIndex] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const wordRect = currentWordElement.getBoundingClientRect();
      
      // Calcular si la palabra actual está fuera de la vista
      const isWordAbove = wordRect.top < containerRect.top;
      const isWordBelow = wordRect.bottom > containerRect.bottom;
      
      if (isWordAbove || isWordBelow) {
        // Scroll suave hacia la palabra actual
        currentWordElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [inputText, isRunning, practiceText]);

  // Formatear tiempo mm:ss
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Renderizado del texto original con marcas y sin movimiento
  function RenderMarkedText() {
    const states = getWordStates();
    return (
      <div 
        ref={textContainerRef}
        className="w-full h-full p-3 border rounded bg-white text-black overflow-y-auto whitespace-normal text-sm leading-tight select-none"
      >
        {states.map((s, i) => (
          <span
            key={i}
            className={
              `inline-block align-baseline min-w-[1ch] px-[1px] py-0 font-normal text-base leading-relaxed transition-none ` +
              (s.status === "correct"
                ? "bg-green-100 text-green-800"
                : s.status === "error"
                ? "bg-red-200 text-red-800 underline decoration-red-500"
                : s.status === "current"
                ? "bg-blue-200 text-blue-800"
                : "")
            }
            style={{
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              boxSizing: 'border-box',
              verticalAlign: 'baseline',
              margin: 0,
              whiteSpace: 'pre',
            }}
          >
            {s.word + (i < states.length - 1 ? ' ' : '')}
          </span>
        ))}
      </div>
    );
  }

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
    setCurrentPrueba(prueba);
          // Limpiar ejercicio anterior
            // Limpiar texto anterior
    setPracticeText(""); // Limpiar texto actual
    setDurationSeconds(prueba.minutos * 60); // Actualizar duración
    setTimer(prueba.minutos * 60); // Actualizar timer según la prueba
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
            </div>
            {isLocked ? (
              <RenderMarkedText />
            ) : (
              <textarea
                className="w-full h-full min-h-[350px] p-3 border rounded resize-none bg-white text-black disabled:bg-gray-200 text-sm leading-tight"
                value={practiceText}
                onChange={(e) => setPracticeText(e.target.value)}
                disabled={true}
                placeholder={isLoadingText ? "Cargando texto..." : "Usa 'Nuevo Texto' para cambiar el fragmento..."}
                style={{ fontSize: '0.875rem', lineHeight: '1.25rem' }}
              />
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
              className="w-full h-full min-h-[350px] p-3 border rounded resize-none text-sm leading-tight bg-white text-black disabled:bg-gray-100"
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
      
      <Footer />
    </div>
  );
}
